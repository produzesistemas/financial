using Microsoft.AspNetCore.Mvc;
using Models;
using System;
using UnitOfWork;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;
using LinqKit;
using System.Linq.Expressions;
using System.Collections.Generic;

namespace financial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private ISubscriptionRepository _subscriptionRepository;
        private IPlanRepository _planRepository;
        private IConfiguration configuration;

        public SubscriptionController(ISubscriptionRepository SubscriptionRepository,
            IPlanRepository PlanRepository,
            IConfiguration Configuration)
        {
            this._subscriptionRepository = SubscriptionRepository;
            this._planRepository = PlanRepository;
            this.configuration = Configuration;
        }

        [HttpGet()]
        [Route("getCurrent")]
        [Authorize()]
        public IActionResult GetCurrent()
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }
                Expression<Func<Subscription, bool>> ps1, ps2;
                var pred = PredicateBuilder.New<Subscription>();
                ps1 = p => p.ApplicationUserId.Equals(id);
                pred = pred.And(ps1);
                ps2 = p => p.Active == true;
                pred = pred.And(ps2);
                return new JsonResult(_subscriptionRepository.GetCurrent(pred));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento da conta: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("saveByAdm")]
        [Authorize()]
        public IActionResult SaveByAdm([FromBody] Subscription _subscription)
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }
                _subscription.ApplicationUserId = id;
                _subscription.Active = true;
                _subscriptionRepository.Insert(_subscription);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat(ex.Message, " - ", ex.InnerException.ToString()));
            }
        }

        [HttpPost()]
        [Route("getPLanByModule")]
        public IActionResult GetPLanByModule(Module module)
        {
            try
            {
                Expression<Func<Plan, bool>> p1, p2;
                var predicate = PredicateBuilder.New<Plan>();
                p1 = p => p.Active == true;
                predicate = predicate.And(p1);
                p2 = p => p.ModuleId == module.Id;
                predicate = predicate.And(p2);
                return new JsonResult(_planRepository.Where(predicate));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos planos de pagamento: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("filter")]
        [Authorize()]
        public IActionResult GetByFilter(Subscription filter)
        {
            try
            {
                Expression<Func<Subscription, bool>> p1;
                var predicate = PredicateBuilder.New<Subscription>();
                if (filter.EstablishmentId > decimal.Zero)
                {
                    p1 = p => p.EstablishmentId == filter.EstablishmentId;
                    predicate = predicate.And(p1);
                    return new JsonResult(_subscriptionRepository.Where(predicate));
                }

                return new JsonResult(_subscriptionRepository.GetAll());

            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento das assinaturas: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("delete")]
        [Authorize()]
        public IActionResult Delete([FromBody] Subscription subscription)
        {
            try
            {
                _subscriptionRepository.Delete(subscription.Id);
                return new OkResult();
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha na exclusão do produto: ", ex.Message));
            }
        }

    }
}
