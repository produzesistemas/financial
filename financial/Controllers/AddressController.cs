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
    public class AddressController : ControllerBase
    {
        private IAddressRepository _addressRepository;
        private IDeliveryRegionRepository _DeliveryRegionRepository;

        public AddressController(
            IAddressRepository addressRepository, IDeliveryRegionRepository deliveryRegionRepository)
        {
            this._addressRepository = addressRepository;
            _DeliveryRegionRepository = deliveryRegionRepository;
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
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }
                Expression<Func<Address, bool>> p1;
                var predicate = PredicateBuilder.New<Address>();
                p1 = p => p.ApplicationUserId == id;
                predicate = predicate.And(p1);
                return new JsonResult(_addressRepository.Where(predicate).ToList());
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Cupons: ", ex.Message));
            }
        }


        //[HttpPost()]
        //[Route("getLast")]
        //[Authorize()]
        //public IActionResult GetLast(DeliveryRegion filter)
        //{
        //    try
        //    {
        //        ClaimsPrincipal currentUser = this.User;
        //        var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
        //        if (id == null)
        //        {
        //            return BadRequest("Identificação do usuário não encontrada.");
        //        }
        //        return new JsonResult(_addressRepository.GetLast(id, filter));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(string.Concat("Falha no carregamento dos Cupons: ", ex.Message));
        //    }
        //}


        [HttpPost()]
        [Route("save")]
        [Authorize()]
        public IActionResult Save(Address address)
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;

                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }

                Expression<Func<DeliveryRegion, bool>> p1, p2, p3;
                var predicate = PredicateBuilder.New<DeliveryRegion>();
                if ((address.PostalCode == null) || (address.EstablishmentId == decimal.Zero))
                {
                    return BadRequest("Dados da região de entrega não encontrado");
                }
                p1 = p => p.PostalCode == address.PostalCode;
                predicate = predicate.And(p1);
                p2 = p => p.EstablishmentId == address.EstablishmentId;
                predicate = predicate.And(p2);
                p3 = p => p.Active == true;
                predicate = predicate.And(p3);

                var deliveryRegion = _DeliveryRegionRepository.Where(predicate).FirstOrDefault();
                if (deliveryRegion == null)
                {
                    return BadRequest("Não entregamos nessa região!");
                }

                if (address.Id > decimal.Zero)
                {
                    _addressRepository.Update(address);
                }
                else
                {
                    address.ApplicationUserId = id;
                    _addressRepository.Insert(address);
                }
                return new OkResult();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost()]
        [Route("delete")]
        [Authorize()]
        public IActionResult Delete(Address address)
        {
            try
            {
                _addressRepository.Delete(address.Id);
                return new OkResult();
            }
            catch (Exception ex)
            {
                if (ex.InnerException.Message.Contains("The DELETE statement conflicted with the REFERENCE constraint"))
                {
                    return BadRequest("O endereço não pode ser excluído. Endereço já utilizado em algum pedido.");
                }
                return BadRequest(ex.Message);
            }
        }

    }
}
