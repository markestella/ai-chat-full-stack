using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatbotApi.src.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedGuestUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] 
                { 
                    "Id", "UserName", "NormalizedUserName", "Email", "NormalizedEmail", 
                    "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp", 
                    "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnabled", "AccessFailedCount"
                },
                values: new object[] 
                {
                    "f6de90d5-4490-46e2-82d4-cae4df7a9eaf",
                    "guest@chatapp.com",
                    "GUEST@CHATAPP.COM",
                    "guest@chatapp.com",
                    "GUEST@CHATAPP.COM",
                    true,
                    "AQAAAAIAAYagAAAAEFyGGmIZBJB7F6Hsk6CIf5DbNTprJseKjyw2fACRWHv0DSPtVM4toEfDICiU0DKsBA==",
                    Guid.NewGuid().ToString(),
                    Guid.NewGuid().ToString(),
                    false,
                    false,
                    false,
                    0
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
