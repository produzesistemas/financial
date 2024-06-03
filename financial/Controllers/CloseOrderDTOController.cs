using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Filters;
using Repositorys;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using UnitOfWork;

namespace petixcoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CloseOrderDTOController : ControllerBase
    {
        private ICloseOrderDTORepository _CloseOrderDTORepository;

        public CloseOrderDTOController(
            ICloseOrderDTORepository CloseOrderDTORepository)
        {
            _CloseOrderDTORepository = CloseOrderDTORepository;
        }

        [HttpPost()]
        [Route("getCloseOrderDTO")]
        [Authorize()]
        public IActionResult GetCloseOrderDTO(CloseOrderDTO filter)
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }
                filter.Id = id;
                return new JsonResult(_CloseOrderDTORepository.Get(filter));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Cupons: ", ex.Message));
            }
        }


 

    }
}
