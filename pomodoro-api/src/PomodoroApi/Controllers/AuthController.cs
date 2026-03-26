using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PomodoroApi.DTOs;
using PomodoroApi.Services;

namespace PomodoroApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    IAuthService authService,
    ITokenService tokenService,
    IConfiguration configuration,
    IHttpClientFactory httpClientFactory,
    IHostEnvironment env) : ControllerBase
{
    private static readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

    // ─── Dev login (Development only) ────────────────────────────────────────

    [HttpPost("dev-login")]
    public async Task<ActionResult<DevLoginResponse>> DevLogin([FromBody] DevLoginRequest request)
    {
        if (!env.IsDevelopment())
            return NotFound();

        var user = await authService.FindOrCreateUserAsync(
            provider: "dev",
            providerId: request.Email,
            name: request.Name,
            email: request.Email,
            avatarUrl: null
        );

        return Ok(new DevLoginResponse(tokenService.GenerateToken(user)));
    }

    // ─── GitHub ──────────────────────────────────────────────────────────────

    [HttpGet("github")]
    public IActionResult LoginWithGithub()
    {
        var clientId = configuration["OAuth:GitHub:ClientId"]
            ?? throw new InvalidOperationException("OAuth:GitHub:ClientId not configured.");
        var callbackUrl = BuildCallbackUrl("github");
        var state = GenerateState();

        Response.Cookies.Append("oauth_state", state, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            MaxAge = TimeSpan.FromMinutes(10),
        });

        var url = $"https://github.com/login/oauth/authorize" +
                  $"?client_id={clientId}" +
                  $"&redirect_uri={Uri.EscapeDataString(callbackUrl)}" +
                  $"&scope=user:email" +
                  $"&state={state}";

        return Redirect(url);
    }

    [HttpGet("github/callback")]
    public async Task<IActionResult> GithubCallback([FromQuery] string code, [FromQuery] string state)
    {
        if (!ValidateState(state)) return BadRequest("Invalid state.");

        var clientId = configuration["OAuth:GitHub:ClientId"]!;
        var clientSecret = configuration["OAuth:GitHub:ClientSecret"]!;
        var http = httpClientFactory.CreateClient();

        // Exchange code for token
        var tokenResponse = await http.PostAsync(
            "https://github.com/login/oauth/access_token",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret,
                ["code"] = code,
            }));

        var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
        var tokenParams = System.Web.HttpUtility.ParseQueryString(tokenContent);
        var accessToken = tokenParams["access_token"];

        if (string.IsNullOrEmpty(accessToken))
            return BadRequest("Failed to obtain access token.");

        // Get user profile
        http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        http.DefaultRequestHeaders.UserAgent.ParseAdd("PomodoroApp/1.0");
        http.DefaultRequestHeaders.Accept.ParseAdd("application/json");

        var profileResponse = await http.GetAsync("https://api.github.com/user");
        var profile = await profileResponse.Content.ReadFromJsonAsync<JsonElement>();

        // GitHub may return null email — fall back to emails endpoint
        var email = profile.TryGetProperty("email", out var emailProp) && emailProp.ValueKind != JsonValueKind.Null
            ? emailProp.GetString()!
            : await GetGithubPrimaryEmail(http);

        var user = await authService.FindOrCreateUserAsync(
            provider: "github",
            providerId: profile.GetProperty("id").GetInt64().ToString(),
            name: profile.TryGetProperty("name", out var nameProp) && nameProp.ValueKind != JsonValueKind.Null
                ? nameProp.GetString()!
                : profile.GetProperty("login").GetString()!,
            email: email,
            avatarUrl: profile.TryGetProperty("avatar_url", out var avatarProp)
                ? avatarProp.GetString()
                : null
        );

        return RedirectToFrontend(user);
    }

    // ─── Google ───────────────────────────────────────────────────────────────

    [HttpGet("google")]
    public IActionResult LoginWithGoogle()
    {
        var clientId = configuration["OAuth:Google:ClientId"]
            ?? throw new InvalidOperationException("OAuth:Google:ClientId not configured.");
        var callbackUrl = BuildCallbackUrl("google");
        var state = GenerateState();

        Response.Cookies.Append("oauth_state", state, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            MaxAge = TimeSpan.FromMinutes(10),
        });

        var url = "https://accounts.google.com/o/oauth2/v2/auth" +
                  $"?client_id={Uri.EscapeDataString(clientId)}" +
                  $"&redirect_uri={Uri.EscapeDataString(callbackUrl)}" +
                  "&response_type=code" +
                  "&scope=openid%20email%20profile" +
                  $"&state={state}";

        return Redirect(url);
    }

    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback([FromQuery] string code, [FromQuery] string state)
    {
        if (!ValidateState(state)) return BadRequest("Invalid state.");

        var clientId = configuration["OAuth:Google:ClientId"]!;
        var clientSecret = configuration["OAuth:Google:ClientSecret"]!;
        var callbackUrl = BuildCallbackUrl("google");
        var http = httpClientFactory.CreateClient();

        // Exchange code for token
        var tokenResponse = await http.PostAsync(
            "https://oauth2.googleapis.com/token",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["code"] = code,
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret,
                ["redirect_uri"] = callbackUrl,
                ["grant_type"] = "authorization_code",
            }));

        var tokenJson = await tokenResponse.Content.ReadFromJsonAsync<JsonElement>();
        var accessToken = tokenJson.GetProperty("access_token").GetString()!;

        // Get user info
        http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        var userResponse = await http.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
        var profile = await userResponse.Content.ReadFromJsonAsync<JsonElement>();

        var user = await authService.FindOrCreateUserAsync(
            provider: "google",
            providerId: profile.GetProperty("id").GetString()!,
            name: profile.GetProperty("name").GetString()!,
            email: profile.GetProperty("email").GetString()!,
            avatarUrl: profile.TryGetProperty("picture", out var pic) ? pic.GetString() : null
        );

        return RedirectToFrontend(user);
    }

    // ─── Facebook ─────────────────────────────────────────────────────────────

    [HttpGet("facebook")]
    public IActionResult LoginWithFacebook()
    {
        var clientId = configuration["OAuth:Facebook:AppId"]
            ?? throw new InvalidOperationException("OAuth:Facebook:AppId not configured.");
        var callbackUrl = BuildCallbackUrl("facebook");
        var state = GenerateState();

        Response.Cookies.Append("oauth_state", state, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            MaxAge = TimeSpan.FromMinutes(10),
        });

        var url = "https://www.facebook.com/v19.0/dialog/oauth" +
                  $"?client_id={Uri.EscapeDataString(clientId)}" +
                  $"&redirect_uri={Uri.EscapeDataString(callbackUrl)}" +
                  "&scope=email,public_profile" +
                  $"&state={state}";

        return Redirect(url);
    }

    [HttpGet("facebook/callback")]
    public async Task<IActionResult> FacebookCallback([FromQuery] string code, [FromQuery] string state)
    {
        if (!ValidateState(state)) return BadRequest("Invalid state.");

        var clientId = configuration["OAuth:Facebook:AppId"]!;
        var clientSecret = configuration["OAuth:Facebook:AppSecret"]!;
        var callbackUrl = BuildCallbackUrl("facebook");
        var http = httpClientFactory.CreateClient();

        // Exchange code for token
        var tokenResponse = await http.GetAsync(
            "https://graph.facebook.com/v19.0/oauth/access_token" +
            $"?client_id={Uri.EscapeDataString(clientId)}" +
            $"&client_secret={Uri.EscapeDataString(clientSecret)}" +
            $"&redirect_uri={Uri.EscapeDataString(callbackUrl)}" +
            $"&code={Uri.EscapeDataString(code)}");

        var tokenJson = await tokenResponse.Content.ReadFromJsonAsync<JsonElement>();
        var accessToken = tokenJson.GetProperty("access_token").GetString()!;

        // Get user profile
        var profileResponse = await http.GetAsync(
            "https://graph.facebook.com/me?fields=id,name,email,picture.type(large)" +
            $"&access_token={Uri.EscapeDataString(accessToken)}");
        var profile = await profileResponse.Content.ReadFromJsonAsync<JsonElement>();

        string? avatarUrl = null;
        if (profile.TryGetProperty("picture", out var pic2) &&
            pic2.TryGetProperty("data", out var picData) &&
            picData.TryGetProperty("url", out var picUrl))
        {
            avatarUrl = picUrl.GetString();
        }

        var user = await authService.FindOrCreateUserAsync(
            provider: "facebook",
            providerId: profile.GetProperty("id").GetString()!,
            name: profile.GetProperty("name").GetString()!,
            email: profile.TryGetProperty("email", out var fbEmail) ? fbEmail.GetString()! : string.Empty,
            avatarUrl: avatarUrl
        );

        return RedirectToFrontend(user);
    }

    // ─── Authenticated endpoints ───────────────────────────────────────────────

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserResponse>> GetCurrentUser()
    {
        var user = await authService.GetUserByIdAsync(GetCurrentUserId());
        if (user is null) return NotFound();

        return Ok(new UserResponse(user.Id, user.Email, user.Name, user.AvatarUrl, user.Provider, user.CreatedAt));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private IActionResult RedirectToFrontend(PomodoroApi.Models.User user)
    {
        var token = tokenService.GenerateToken(user);
        var frontendUrl = configuration["Frontend:Url"] ?? "http://localhost:3000";
        return Redirect($"{frontendUrl}/auth/callback?token={Uri.EscapeDataString(token)}");
    }

    private string BuildCallbackUrl(string provider)
    {
        var apiUrl = configuration["Api:Url"] ?? $"{Request.Scheme}://{Request.Host}";
        return $"{apiUrl}/api/auth/{provider}/callback";
    }

    private string GenerateState()
    {
        var state = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32));
        return state.Replace("+", "-").Replace("/", "_").TrimEnd('=');
    }

    private bool ValidateState(string state)
    {
        var cookie = Request.Cookies["oauth_state"];
        Response.Cookies.Delete("oauth_state");
        return !string.IsNullOrEmpty(cookie) && cookie == state;
    }

    private Guid GetCurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
               ?? User.FindFirstValue("sub")
               ?? throw new UnauthorizedAccessException();
        return Guid.Parse(sub);
    }

    private async Task<string> GetGithubPrimaryEmail(HttpClient http)
    {
        var emailsResponse = await http.GetAsync("https://api.github.com/user/emails");
        var emails = await emailsResponse.Content.ReadFromJsonAsync<JsonElement[]>() ?? [];

        foreach (var email in emails)
        {
            if (email.TryGetProperty("primary", out var primary) && primary.GetBoolean() &&
                email.TryGetProperty("email", out var emailProp))
            {
                return emailProp.GetString() ?? string.Empty;
            }
        }

        return string.Empty;
    }
}
