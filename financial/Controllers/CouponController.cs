using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Filters;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using UnitOfWork;

namespace petixcoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponController : ControllerBase
    {
        private ICouponRepository _cupomRepository;

        public CouponController(
            ICouponRepository cupomRepository)
        {
            this._cupomRepository = cupomRepository;
        }

        [HttpPost()]
        [Route("filter")]
        [Authorize()]
        public IActionResult GetByFilter(Coupon filter)
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
                Expression<Func<Coupon, bool>> p1, p2;
                var predicate = PredicateBuilder.New<Coupon>();
                if (filter.Description != null)
                {
                    p1 = p => p.Description == filter.Description;
                    predicate = predicate.And(p1);
                    return new JsonResult(_cupomRepository.Where(predicate).ToList());
                }
                p2 = p => p.EstablishmentId == establishmentId;
                predicate = predicate.And(p2);

                return new JsonResult(_cupomRepository.Where(predicate));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Cupons: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("getByCodigo")]
        [Authorize()]
        public IActionResult GetByCodigo(Coupon filter)
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }
                Expression<Func<Coupon, bool>> p1, p2;
                var predicate = PredicateBuilder.New<Coupon>();
                p1 = p => p.Code == filter.Code;
                predicate = predicate.And(p1);
                p2 = p => p.EstablishmentId == filter.EstablishmentId;
                predicate = predicate.And(p2);

                var cupom = _cupomRepository.Where(predicate).FirstOrDefault();
                if (cupom != null)
                {
                    if (!cupom.Active)
                    {
                        return BadRequest("Cupom expirado!");
                    }
                    if (!cupom.General)
                    {
                        if (cupom.ClientId != id)
                        {
                            return BadRequest("Esse cupom pertence a outro usuário!");
                        }
                    }
                    if ((DateTime.Now.Date >= cupom.InitialDate.Date) && (DateTime.Now.Date <= cupom.FinalDate.Date))
                    {
                        return new JsonResult(cupom);
                    } else
                    {
                        return BadRequest("Cupom expirado!");
                    }

                    //Expression<Func<Pedido, bool>> p2, p3;
                    //var pred = PredicateBuilder.New<Pedido>();
                    //p2 = p => p.CupomId == cupom.Id;
                    //p3 = p => p.ApplicationUserId == id;
                    //pred = pred.And(p2);
                    //pred = pred.And(p3);
                    //if (pedidoRepository.Where(pred).Any())
                    //{
                    //    return BadRequest("Cupom já utilizado!");
                    //}

                }

                return new JsonResult(cupom);
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Cupons: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("save")]
        [Authorize()]
        public IActionResult Save(Coupon cupom)
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

                if (cupom.Id > decimal.Zero)
                {
                    _cupomRepository.Update(cupom);
                }
                else
                {
                    cupom.Active = true;
                    cupom.AspNetUsersId = id;
                    cupom.CreateDate = DateTime.Now;
                    cupom.EstablishmentId = establishmentId;
                    if (cupom.ClientId == "") cupom.ClientId = null;
                    _cupomRepository.Insert(cupom);
                }
                return new OkResult();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                return new JsonResult(_cupomRepository.Get(id));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Cupom não encontrado!", ex.Message));
            }
        }

        [HttpDelete("{id}")]
        [Authorize()]
        public IActionResult Delete(int id)
        {
            try
            {
                _cupomRepository.Delete(id);
                return new OkResult();
            }
            catch (Exception ex)
            {
                if (ex.InnerException.Message.Contains("The DELETE statement conflicted with the REFERENCE constraint"))
                {
                    return BadRequest("O cupom não pode ser excluído. Cupom já utilizado por algum cliente. Considere desativar!");
                }
                return BadRequest(ex.Message);
            }
        }

        [HttpPost()]
        [Route("active")]
        [Authorize()]
        public IActionResult Active(Coupon cupom)
        {
            try
            {
                _cupomRepository.Active(cupom.Id);
                return new OkResult();
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }


    }
}
