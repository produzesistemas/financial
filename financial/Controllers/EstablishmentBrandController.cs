using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Filters;
using Repositorys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using UnitOfWork;

namespace petixcoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstablishmentBrandController : ControllerBase
    {
        private IEstablishmentBrandCreditRepository _EstablishmentBrandCreditRepository;
        private IEstablishmentBrandDebitRepository _EstablishmentBrandDebitRepository;
        private IBrandRepository _BrandRepository;

        public EstablishmentBrandController(
            IEstablishmentBrandCreditRepository EstablishmentBrandCreditRepository,
             IEstablishmentBrandDebitRepository EstablishmentBrandDebitRepository,
            IBrandRepository BrandRepository)
        {
            _EstablishmentBrandCreditRepository = EstablishmentBrandCreditRepository;
            _EstablishmentBrandDebitRepository = EstablishmentBrandDebitRepository;
            _BrandRepository = BrandRepository;
        }

        [HttpPost()]
        [Route("getCreditByEstablishment")]
        public IActionResult GetCreditByEstablishment(EstablishmentBrandCredit establishmentBrandCredit)
        {
            try
            {
                Expression<Func<EstablishmentBrandCredit, bool>> p1, p2;
                var predicate = PredicateBuilder.New<EstablishmentBrandCredit>();
                p1 = p => p.EstablishmentId == establishmentBrandCredit.EstablishmentId;
                predicate = predicate.And(p1);
                p2 = p => p.Active == true;
                predicate = predicate.And(p2);
                return new JsonResult(_EstablishmentBrandCreditRepository.Where(predicate).ToList());
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento das bandeiras: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("getDebitByEstablishment")]
        public IActionResult GetDebitByEstablishment(EstablishmentBrandDebit establishmentBrandDebit)
        {
            try
            {
                Expression<Func<EstablishmentBrandDebit, bool>> p1, p2;
                var predicate = PredicateBuilder.New<EstablishmentBrandDebit>();
                p1 = p => p.EstablishmentId == establishmentBrandDebit.EstablishmentId;
                predicate = predicate.And(p1);
                p2 = p => p.Active == true;
                predicate = predicate.And(p2);
                return new JsonResult(_EstablishmentBrandDebitRepository.Where(predicate).ToList());
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento das bandeiras: ", ex.Message));
            }
        }

        [HttpGet()]
        [Route("getAll")]
        public IActionResult GetAll()
        {
            try
            {
                return new JsonResult(_BrandRepository.GetAll());
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Clientes: ", ex.Message));
            }
        }

        [HttpGet()]
        [Route("getCredit")]
        public IActionResult GetCredit()
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var establishmentId = Convert.ToInt32(currentUser.Claims.FirstOrDefault(z => z.Type.Contains("sid")).Value);
                if (establishmentId == decimal.Zero)
                {
                    return BadRequest("Usuário sem Estabelecimento cadastrado.");
                }

                Expression<Func<EstablishmentBrandCredit, bool>> p1, p2;
                var predicate = PredicateBuilder.New<EstablishmentBrandCredit>();
                p1 = p => p.EstablishmentId == establishmentId;
                predicate = predicate.And(p1);
                return new JsonResult(_EstablishmentBrandCreditRepository.Where(predicate).ToList());
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento das bandeiras: ", ex.Message));
            }
        }

        [HttpGet()]
        [Route("getDebit")]
        public IActionResult GetDebit()
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var establishmentId = Convert.ToInt32(currentUser.Claims.FirstOrDefault(z => z.Type.Contains("sid")).Value);
                if (establishmentId == decimal.Zero)
                {
                    return BadRequest("Usuário sem Estabelecimento cadastrado.");
                }

                Expression<Func<EstablishmentBrandDebit, bool>> p1, p2;
                var predicate = PredicateBuilder.New<EstablishmentBrandDebit>();
                p1 = p => p.EstablishmentId == establishmentId;
                predicate = predicate.And(p1);
                return new JsonResult(_EstablishmentBrandDebitRepository.Where(predicate).ToList());
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento das bandeiras: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("saveCredit")]
        [Authorize()]
        public IActionResult SaveCredit([FromBody] EstablishmentBrandCredit establishmentBrandCredit)
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var establishmentId = Convert.ToInt32(currentUser.Claims.FirstOrDefault(z => z.Type.Contains("sid")).Value);
                if (establishmentId == decimal.Zero)
                {
                    return BadRequest("Usuário sem Estabelecimento cadastrado.");
                }
                establishmentBrandCredit.EstablishmentId = establishmentId;
                _EstablishmentBrandCreditRepository.Insert(establishmentBrandCredit);

                return new OkResult();
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no cadastro do horário: ", ex.InnerException));
            }
        }

        [HttpPost()]
        [Route("saveDebit")]
        [Authorize()]
        public IActionResult SaveDebit([FromBody] EstablishmentBrandDebit establishmentBrandDebit)
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var establishmentId = Convert.ToInt32(currentUser.Claims.FirstOrDefault(z => z.Type.Contains("sid")).Value);
                if (establishmentId == decimal.Zero)
                {
                    return BadRequest("Usuário sem Estabelecimento cadastrado.");
                }
                establishmentBrandDebit.EstablishmentId = establishmentId;
                _EstablishmentBrandDebitRepository.Insert(establishmentBrandDebit);

                return new OkResult();
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no cadastro do horário: ", ex.InnerException));
            }
        }


    }
}
