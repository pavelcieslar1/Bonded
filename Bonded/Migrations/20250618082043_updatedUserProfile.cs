using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bonded.Migrations
{
    /// <inheritdoc />
    public partial class updatedUserProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Chronotype",
                table: "UserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Kids",
                table: "UserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Life",
                table: "UserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonalSpace",
                table: "UserProfiles",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Chronotype",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "Kids",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "Life",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PersonalSpace",
                table: "UserProfiles");
        }
    }
}
