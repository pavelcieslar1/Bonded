using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bonded.Migrations
{
    /// <inheritdoc />
    public partial class updatedHobbyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "Hobbies",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Hobbies");
        }
    }
}
