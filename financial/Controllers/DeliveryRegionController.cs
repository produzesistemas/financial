using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using UnitOfWork;

namespace financial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveryRegionController : ControllerBase
    {
        private IDeliveryRegionRepository _DeliveryRegionRepository;

        public DeliveryRegionController(
            IDeliveryRegionRepository DeliveryRegionRepository)
        {
            this._DeliveryRegionRepository = DeliveryRegionRepository;
        }

        [HttpPost()]
        [Route("filter")]
        [Authorize()]
        public IActionResult GetByFilter(DeliveryRegion filter)
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

                Expression<Func<DeliveryRegion, bool>> p1, p2;
                var predicate = PredicateBuilder.New<DeliveryRegion>();
                if (filter.PostalCode != "")
                {
                    p1 = p => p.PostalCode == filter.PostalCode;
                    predicate = predicate.And(p1);
                    
                }

                p2 = p => p.EstablishmentId == establishmentId;
                predicate = predicate.And(p2);
                return new JsonResult(_DeliveryRegionRepository.Where(predicate));

            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Horários de funcionamento: ", ex.Message));
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                return new JsonResult(_DeliveryRegionRepository.Get(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost()]
        [Route("save")]
        [Authorize()]
        public IActionResult Save(DeliveryRegion deliveryRegion)
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }
                var establishmentId = Convert.ToInt32(currentUser.Claims.FirstOrDefault(z => z.Type.Contains("sid")).Value);
                if (establishmentId == decimal.Zero)
                {
                    return BadRequest("Usuário sem Estabelecimento cadastrado.");
                }

                if (deliveryRegion.Id > decimal.Zero)
                {
                    _DeliveryRegionRepository.Update(deliveryRegion);
                }
                else
                {
                    deliveryRegion.ApplicationUserId = id;
                    deliveryRegion.EstablishmentId = establishmentId;
                    _DeliveryRegionRepository.Insert(deliveryRegion);
                }
                return new OkResult();
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }

        [HttpPost()]
        [Route("delete")]
        [Authorize()]
        public IActionResult Delete(DeliveryRegion deliveryRegion)
        {
            try
            {
                _DeliveryRegionRepository.Delete(deliveryRegion.Id);
                return new OkResult();
            }
            catch (Exception ex)
            {
                if (ex.InnerException.Message.Contains("The DELETE statement conflicted with the REFERENCE constraint"))
                {
                    return BadRequest("A região de entrega não pode ser excluída. Está relacionada com um pedido. Considere desativar!");
                }
                return BadRequest(string.Concat("Falha na exclusão do serviço: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("active")]
        [Authorize()]
        public IActionResult Active(DeliveryRegion deliveryRegion)
        {
            try
            {
                _DeliveryRegionRepository.Active(deliveryRegion.Id);
                return new OkResult();
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }

        [HttpPost()]
        [Route("getAvailability")]
        public IActionResult GetAvailability(DeliveryRegion filter)
        {
            try
            {
                Expression<Func<DeliveryRegion, bool>> p1, p2, p3;
                var predicate = PredicateBuilder.New<DeliveryRegion>();
                if ((filter.PostalCode == null) || (filter.EstablishmentId == decimal.Zero))
                {
                    return BadRequest("Dados da região de entrega não encontrado");
                }
                p1 = p => p.PostalCode == filter.PostalCode;
                predicate = predicate.And(p1);
                p2 = p => p.EstablishmentId == filter.EstablishmentId;
                predicate = predicate.And(p2);
                p3 = p => p.Active == true;
                predicate = predicate.And(p3);

                var deliveryRegion = _DeliveryRegionRepository.Where(predicate).FirstOrDefault();
                if (deliveryRegion == null)
                {
                    return BadRequest("Não entregamos nessa região!");
                }
                return new JsonResult(deliveryRegion);
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento da região de entrega: ", ex.Message));
            }
        }
    }
}