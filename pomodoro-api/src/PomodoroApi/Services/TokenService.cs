using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PomodoroApi.Models;

namespace PomodoroApi.Services;

public interface ITokenService
{
    string GenerateToken(User user);
    ClaimsPrincipal? ValidateToken(string token);
}

public class TokenService(IConfiguration configuration) : ITokenService
{
    private readonly string _secret = configuration["Jwt:Secret"]
        ?? throw new InvalidOperationException("Jwt:Secret is not configured.");
    private readonly string _issuer = configuration["Jwt:Issuer"] ?? "pomodoro-api";
    private readonly string _audience = configuration["Jwt:Audience"] ?? "pomodoro-app";

    public string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Name, user.Name),
            new Claim("provider", user.Provider),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));

        var validationParams = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _issuer,
            ValidateAudience = true,
            ValidAudience = _audience,
            ValidateLifetime = true,
            IssuerSigningKey = key,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,
        };

        try
        {
            return new JwtSecurityTokenHandler().ValidateToken(token, validationParams, out _);
        }
        catch
        {
            return null;
        }
    }
}
