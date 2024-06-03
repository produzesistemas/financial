using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
using Repositorys;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using UnitOfWork;

namespace financial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OpeningHoursController : ControllerBase
    {
        private IOpeningHoursRepository _OpeningHoursRepository;

        public OpeningHoursController(
   IOpeningHoursRepository OpeningHoursRepository
    )
        {
            _OpeningHoursRepository = OpeningHoursRepository;
        }

        [HttpGet()]
        [Route("getAll")]
        [Authorize()]
        public IActionResult GetAll()
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                var establishmentId = Convert.ToInt32(currentUser.Claims.FirstOrDefault(z => z.Type.Contains("sid")).Value);
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }
                if (establishmentId == decimal.Zero)
                {
                    return BadRequest("Usuário sem Estabelecimento cadastrado.");
                }

                Expression<Func<OpeningHours, bool>> ps1, ps2;
                var pred = PredicateBuilder.New<OpeningHours>();
                ps2 = p => p.EstablishmentId == establishmentId;
                pred = pred.And(ps2);
                return new JsonResult(_OpeningHoursRepository.Where(pred));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Horários: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("save")]
        [Authorize()]
        public IActionResult Save([FromBody] OpeningHours openingHours)
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                var establishmentId = Convert.ToInt32(currentUser.Claims.FirstOrDefault(z => z.Type.Contains("sid")).Value);
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }
                if (establishmentId == decimal.Zero)
                {
                    return BadRequest("Usuário sem Estabelecimento cadastrado.");
                }

                if (openingHours.Id > decimal.Zero)
                {
                    _OpeningHoursRepository.Update(openingHours);
                }
                else
                {
                    openingHours.ApplicationUserId = id;
                    openingHours.EstablishmentId = establishmentId;
                    openingHours.CreateDate = DateTime.Now;
                    openingHours.Active = true;
                    _OpeningHoursRepository.Insert(openingHours);
                }
                return new OkResult();
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no cadastro do horário: ", ex.InnerException));
            }
        }

        [HttpPost()]
        [Route("delete")]
        [Authorize()]
        public IActionResult Delete([FromBody] OpeningHours openingHours)
        {
            try
            {
                _OpeningHoursRepository.Delete(openingHours.Id);
                return new OkResult();
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha na exclusão do produto: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("active")]
        [Authorize()]
        public IActionResult Active(OpeningHours openingHours)
        {
            try
            {
                _OpeningHoursRepository.Active(openingHours.Id);
                return new OkResult();
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }
        [HttpGet("{id}")]
        [Authorize()]
        public IActionResult Get(int id)
        {
            try
            {
                return new JsonResult(_OpeningHoursRepository.Get(id));
            }
            catch (Exception ex)
            {
                return BadRequest("Comanda não encontrada!" + ex.Message);
            }
        }

        [HttpPost()]
        [Route("getByEstablishment")]
        public IActionResult GetByEstablishment(DelicatessenProduct filter)
        {
            try
            {
                Expression<Func<OpeningHours, bool>> p1;
                var predicate = PredicateBuilder.New<OpeningHours>();
                p1 = p => p.EstablishmentId == filter.EstablishmentId && p.Active == true;
                predicate = predicate.And(p1);
                return new JsonResult(_OpeningHoursRepository.Where(predicate));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Horários: ", ex.Message));
            }
        }
    }

}