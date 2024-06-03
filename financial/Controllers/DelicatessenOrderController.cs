using LinqKit;
using MercadoPago.Client;
using MercadoPago.Client.Payment;
using MercadoPago.Http;
using MercadoPago.Resource.Payment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Checkout;
using Models.Filters;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Threading.Tasks;
using UnitOfWork;

namespace financial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DelicatessenOrderController : ControllerBase
    {
        private IDelicatessenOrderRepository _DelicatessenOrderRepository;
        private IDelicatessenProductRepository _DelicatessenProductRepository;
        private ICouponRepository _cupomRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private IEstablishmentRepository _EstablishmentRepository;
        public DelicatessenOrderController(
            UserManager<ApplicationUser> userManager,
            IDelicatessenOrderRepository DelicatessenOrderRepository,
            IDelicatessenProductRepository DelicatessenProductRepository,
            ICouponRepository cupomRepository,
            IEstablishmentRepository establishmentRepository)
        {
            this._DelicatessenOrderRepository = DelicatessenOrderRepository;
            this._DelicatessenProductRepository = DelicatessenProductRepository;
            this._cupomRepository = cupomRepository;
            this._userManager = userManager;
            this._EstablishmentRepository = establishmentRepository;
        }

        [HttpPost()]
        [Route("filter")]
        [Authorize()]
        public IActionResult GetByFilter(FilterDefault filter)
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

                Expression<Func<DelicatessenOrder, bool>> p1, p2;
                var predicate = PredicateBuilder.New<DelicatessenOrder>();
                if (filter.Id > decimal.Zero)
                {
                    p1 = p => p.DelicatessenOrderTrackings.Any(x => x.StatusOrderId == filter.Id);
                    predicate = predicate.And(p1);
                }
                
                p2 = p => p.EstablishmentId == establishmentId;
                predicate = predicate.And(p2);
                return new JsonResult(_DelicatessenOrderRepository.Where(predicate));
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
                return new JsonResult(_DelicatessenOrderRepository.Get(id));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento do pedido: ", ex.Message));

            }
        }

        [HttpPost()]
        [Route("getToPartner")]
        public IActionResult GetToPartner(DelicatessenOrder filter)
        {
            try
            {
                return new JsonResult(_DelicatessenOrderRepository.GetToPartner(filter.Id));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento do pedido: ", ex.Message));

            }
        }

        [HttpPost()]
        [Route("save")]
        [Authorize()]
        public async Task<IActionResult> SaveAsync([FromBody] DelicatessenOrder _DelicatessenOrder)
        {
            try
            {
                this._DelicatessenProductRepository.checkActive(_DelicatessenOrder.DelicatessenOrderProducts);

                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }

                if (_DelicatessenOrder.CouponId.HasValue)
                {
                    var coupon = _cupomRepository.Check(_DelicatessenOrder.CouponId.Value, id);
                }

                _DelicatessenOrder.ApplicationUserId = id;
                _DelicatessenOrder.RequestDate = DateTime.Now;
                _DelicatessenOrderRepository.Insert(_DelicatessenOrder);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //to do - descomentar autorização após receber token
        [HttpPost()]
        [Route("getByUser")]
        [Authorize()]
        public IActionResult GetByUser(FilterDefault filter)
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }

                Expression<Func<DelicatessenOrder, bool>> p1, p2;
                var predicate = PredicateBuilder.New<DelicatessenOrder>();
                p1 = p => p.ApplicationUserId == id;
                predicate = predicate.And(p1);
                p2 = p => p.EstablishmentId == filter.EstablishmentId;
                predicate = predicate.And(p2);
                return new JsonResult(_DelicatessenOrderRepository.GetByUser(predicate).OrderByDescending(x => x.RequestDate));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Horários de funcionamento: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("paymentMercadoPago")]
        [Authorize()]
        public async Task<IActionResult> PaymentMercadoPago([FromBody] PaymentMercadoPago paymentMercadoPago)
        {
            ClaimsPrincipal currentUser = this.User;
            var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
            if (id == null)
            {
                return BadRequest("Identificação do usuário não encontrada.");
            }
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return BadRequest("Usuário não encontrado.");
            }

            Expression<Func<Establishment, bool>> p1;
            var predicate = PredicateBuilder.New<Establishment>();
                p1 = p => p.Id == paymentMercadoPago.EstablishmentId;
                predicate = predicate.And(p1);
            var establishment = _EstablishmentRepository.Where(predicate).FirstOrDefault();
            if (establishment == null || establishment.AccessTokenMercadoPago == null)
            {
                return BadRequest("Não foi encontrado o access token do estabelecimento.");
            }

            var requestOptions = new RequestOptions();
            requestOptions.AccessToken = establishment.AccessTokenMercadoPago;
            requestOptions.CustomHeaders.Add(Headers.IDEMPOTENCY_KEY, "YOUR_IDEMPOTENCY_KEY");

            var request = new PaymentCreateRequest();
            request.Token = paymentMercadoPago.Token;
            request.Description = establishment.Name;
            request.Installments = paymentMercadoPago.Installments;
            request.PaymentMethodId = paymentMercadoPago.PaymentMethodId;
            request.TransactionAmount = paymentMercadoPago.DelicatessenOrder.GetTotal();
            var payer = new PaymentPayerRequest
            {
                Email = user.Email,
            };
            request.Payer = payer;

            //var request = new PaymentCreateRequest
            //{
            //    TransactionAmount = 10,
            //    Token = paymentMercadoPago.Token,
            //    Description = establishment.Name,
            //    Installments = paymentMercadoPago.Installments,
            //    PaymentMethodId = paymentMercadoPago.PaymentMethodId,
            //    Payer = new PaymentPayerRequest
            //    {
            //        Email = user.Email,
            //    }
            //};

            var client = new PaymentClient();
            Payment payment = await client.CreateAsync(request, requestOptions);

            Console.WriteLine($"Payment ID: {payment.Id}");
            return Ok();
        }

        [HttpPost()]
        [Route("cancelByClient")]
        [Authorize()]
        public IActionResult CancelByClient(DelicatessenOrder _DelicatessenOrder)
        {
            try
            {
                    if (_DelicatessenOrder.Id > 0)
                    {
                        _DelicatessenOrderRepository.CancelByClient(_DelicatessenOrder.Id);
                    }
            }
            catch (Exception ex)
            {
                return BadRequest("Falha no cancelamento do pedido.");
            }

            return Ok(); ;
        }
    }
}