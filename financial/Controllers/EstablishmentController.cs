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
    public class EstablishmentController : ControllerBase
    {
        private IEstablishmentRepository _EstablishmentRepository;
        private IWebHostEnvironment _hostEnvironment;
        private IConfiguration _configuration;
        public EstablishmentController(
   IEstablishmentRepository EstablishmentRepository,
   IWebHostEnvironment environment, IConfiguration Configuration
    )
        {
            _EstablishmentRepository = EstablishmentRepository;
            _hostEnvironment = environment;
            _configuration = Configuration;

        }

        [HttpPost()]
        [Route("update")]
        [Authorize()]
        public IActionResult Update()
        {
            try
            {
                var establishment = JsonConvert.DeserializeObject<Establishment>(Convert.ToString(Request.Form["establishment"]));
                var pathToSave = string.Concat(_hostEnvironment.ContentRootPath, _configuration["pathFileEstablishment"]);
                var fileDelete = pathToSave;
                var files = Request.Form.Files;

                if (files.Count() > decimal.Zero)
                {
                    var extension = Path.GetExtension(files[0].FileName);
                    var fileName = string.Concat(Guid.NewGuid().ToString(), extension);
                    var fullPath = Path.Combine(pathToSave, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        files[0].CopyTo(stream);
                        establishment.ImageName = fileName;
                    }
                }
                _EstablishmentRepository.Update(establishment, pathToSave, files);

                return new JsonResult("Usuário registrado com sucesso! Verifique sua caixa de email e confirme o cadastro.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException);
            }
        }

        [HttpPost()]
        [Route("active")]
        [Authorize()]
        public IActionResult Active(Establishment establishment)
        {
            try
            {
                _EstablishmentRepository.Active(establishment.Id);
                return new OkResult();
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                return new JsonResult(_EstablishmentRepository.Get(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
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
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }

                Expression<Func<Establishment, bool>> p1;
                var predicate = PredicateBuilder.New<Establishment>();
                if (filter.Search != null)
                {
                    p1 = p => p.Name == filter.Search;
                    predicate = predicate.And(p1);
                    return new JsonResult(_EstablishmentRepository.Where(predicate));
                }

                return new JsonResult(_EstablishmentRepository.GetAll());
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Horários de funcionamento: ", ex.Message));
            }
        }

        [HttpGet()]
        [Route("getAll")]
        public IActionResult GetAll()
        {
            try
            {
                return new JsonResult(_EstablishmentRepository.GetAll());
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Clientes: ", ex.Message));
            }
        }

        [HttpGet()]
        [Route("getByOwner")]
        [Authorize()]
        public IActionResult GetByOwner()
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }
                return new JsonResult(_EstablishmentRepository.GetByOwnerUpdate(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost()]
        [AllowAnonymous]
        [Route("sendMessage")]
        public IActionResult SendMessage(SendMessage sendMessage)
        {
            try
            {
                MailMessage mail = new MailMessage();
                mail.From = new MailAddress(_configuration["FromEmail"].ToString());
                mail.To.Add(_configuration["MasterEmail"].ToString());
                mail.Subject = sendMessage.Message;
                mail.Body = "<div>Nome completo: " + sendMessage.Name + "</div>" +
                        "<div> Email: " + sendMessage.Email + "</div>" +
                        "<div> Telefone de contato: " + sendMessage.Phone + "</div>";
                mail.IsBodyHtml = true;
                SmtpClient smtp = new SmtpClient(_configuration["STMPEmail"].ToString(), Convert.ToInt32(_configuration["PortEmail"].ToString()));
                smtp.Credentials = new System.Net.NetworkCredential(_configuration["UserEmail"].ToString(), _configuration["PassEmail"].ToString());
                smtp.Send(mail);

                return new OkResult();

            }
            catch (SmtpFailedRecipientException ex)
            {
                return BadRequest(string.Concat("Falha ao enviar mensagem - ", ex.Message));
            }
            catch (SmtpException ex)
            {
                return BadRequest(string.Concat("Falha ao enviar mensagem - ", ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha ao enviar mensagem - ", ex.Message));
            }

        }

		[HttpPost()]
		[Route("deleteImage")]
		[Authorize()]
		public IActionResult DeleteImage(Establishment establishment)
		{
			try
			{
				var pathToSave = string.Concat(_hostEnvironment.ContentRootPath, _configuration["pathFileEstablishment"]);
				_EstablishmentRepository.DeleteImage(establishment, pathToSave);
				return new OkResult();
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

	}
}