using database.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class PartController : Controller
    {
        private readonly PartService _partService;
        private readonly UserManager<User> _userManager;

        public PartController(PartService partService, UserManager<User> userManager)
        {
            _partService = partService;
            _userManager = userManager;
        }

        [HttpGet("specific/{id}")]
        public async Task<IActionResult> GetSpecificPart(int id)
        {
            try
            {
                var part = await _partService.GetPartByIdAsync(id);
                if (part != null)
                {
                    return Ok(part);
                }
                return NotFound();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet("all/{id}")]
        public async Task<IActionResult> GetAllParts(int id)
        {
            try
            {
                var parts = await _partService.GetAllPartsAsync(id);
                return Ok(parts);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost("add/{ticketId}")]
        public async Task<IActionResult> AddPart([FromBody] PartModel partModel, int ticketId)
        {
            try
            {
                var result = await _partService.AddPartAsync(partModel, ticketId);
                if (result.Succeeded)
                {
                    return Ok(
                        new
                        {
                            Success = true,
                            Message = "Part has been added"
                        }
                    );
                }
                return BadRequest();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdatePart([FromBody] PartModel partModel, int id)
        {
            try
            {
                var result = await _partService.UpdatePartAsync(partModel, id);
                if (result.Succeeded)
                {
                    return Ok(
                        new
                        {
                            Success = true,
                            Message = "Part has been updated"
                        }
                    );
                }
                return BadRequest();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePart(int id)
        {
            try
            {
                var result = await _partService.DeletePartAsync(id);
                if (result.Succeeded)
                {
                    return Ok(
                        new
                        {
                            Success = true,
                            Message = "Part has been deleted"
                        }
                    );
                }
                return BadRequest();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}