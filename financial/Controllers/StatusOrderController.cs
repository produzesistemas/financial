using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Models;
using Models.Filters;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Mail;
using System.Security.Claims;
using UnitOfWork;

namespace financial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusOrderController : ControllerBase
    {
        private IStatusOrderRepository _StatusOrderRepository;
        public StatusOrderController(
   IStatusOrderRepository StatusOrderRepository
    )
        {
            _StatusOrderRepository = StatusOrderRepository;

        }


        [HttpGet()]
        [Route("getAll")]
        public IActionResult GetAll()
        {
            try
            {
                return new JsonResult(_StatusOrderRepository.GetAll());
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Clientes: ", ex.Message));
            }
        }

	}
}