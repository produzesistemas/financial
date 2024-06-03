using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Models;
using Newtonsoft.Json;
using Repositorys;
using System;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using UnitOfWork;

namespace financial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private ICategoryRepository _CategoryRepository;
		private IWebHostEnvironment _hostEnvironment;
		private IConfiguration _configuration;
		private ICategoryDTORepository _CategoryDTORepository;

		public CategoryController(
            ICategoryRepository CategoryRepository,
						IWebHostEnvironment environment,
			IConfiguration Configuration,
			ICategoryDTORepository CategoryDTORepository)
        {
            this._CategoryRepository = CategoryRepository;
			_hostEnvironment = environment;
			_configuration = Configuration;
			_CategoryDTORepository = CategoryDTORepository;
		}

        [HttpPost()]
        [Route("filter")]
        [Authorize()]
        public IActionResult GetByFilter(Category filter)
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

                Expression<Func<Category, bool>> p1, p2, p3;
                var predicate = PredicateBuilder.New<Category>();
                if (filter.Description != "")
                {
                    p1 = p => p.Description == filter.Description;
                    predicate = predicate.And(p1);
                }

                p2 = p => p.EstablishmentId == establishmentId;
                predicate = predicate.And(p2);

                return new JsonResult(_CategoryRepository.Where(predicate));

            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Horários de funcionamento: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("getActive")]
        [Authorize()]
        public IActionResult getActive(Category filter)
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

                Expression<Func<Category, bool>> p1, p2, p3;
                var predicate = PredicateBuilder.New<Category>();
                    p1 = p => p.Active == true;
                    predicate = predicate.And(p1);
                p2 = p => p.EstablishmentId == establishmentId;
                predicate = predicate.And(p2);

                return new JsonResult(_CategoryRepository.Where(predicate));

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
                return new JsonResult(_CategoryRepository.Get(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost()]
        [Route("save")]
        [Authorize()]
        public IActionResult Save()
        {
            try
            {
				var category = JsonConvert.DeserializeObject<Category>(Convert.ToString(Request.Form["category"]));
				var pathToSave = string.Concat(_hostEnvironment.ContentRootPath, _configuration["pathFileCategory"]);
				var fileDelete = pathToSave;
				var files = Request.Form.Files;
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

                if (category.Id > decimal.Zero)
                {
					if (files.Count() > decimal.Zero)
					{
						var extension = Path.GetExtension(files[0].FileName);
						var fileName = string.Concat(Guid.NewGuid().ToString(), extension);
						var fullPath = Path.Combine(pathToSave, fileName);
						using (var stream = new FileStream(fullPath, FileMode.Create))
						{
							files[0].CopyTo(stream);
							category.ImageName = fileName;
						}
					}
					_CategoryRepository.Update(category, pathToSave, files);
                }
                else
                {

                    category.ApplicationUserId = id;
                    category.EstablishmentId = establishmentId;
					var extension = Path.GetExtension(files[0].FileName);
					var fileName = string.Concat(Guid.NewGuid().ToString(), extension);
					var fullPath = Path.Combine(pathToSave, fileName);
					using (var stream = new FileStream(fullPath, FileMode.Create))
					{
						files[0].CopyTo(stream);
						category.ImageName = fileName;
					}
					_CategoryRepository.Insert(category);
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
        public IActionResult Delete(Category category)
        {
            try
            {
				var pathToSave = string.Concat(_hostEnvironment.ContentRootPath, _configuration["pathFileCategory"]);
				_CategoryRepository.Delete(category.Id, pathToSave);
                return new OkResult();
            }
            catch (Exception ex)
            {
                if (ex.InnerException.Message.Contains("The DELETE statement conflicted with the REFERENCE constraint"))
                {
                    return BadRequest("A categoria não pode ser excluída. Está relacionada com um produto. Considere desativar!");
                }
                return BadRequest(string.Concat("Falha na exclusão do serviço: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("active")]
        [Authorize()]
        public IActionResult Active(Category category)
        {
            try
            {
                _CategoryRepository.Active(category.Id);
                return new OkResult();
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }

		[HttpPost()]
		[Route("getInitialCategorys")]
		public IActionResult getInitialCategorys(CategoryDTO filter)
		{
			try
			{
				if (filter.EstablishmentId == decimal.Zero)
				{
					return BadRequest("Estabelecimento não encontrado cadastrado.");
				}
				return new JsonResult(_CategoryDTORepository.Get(filter));
			}
			catch (Exception ex)
			{
				return BadRequest(string.Concat("Falha no carregamento dos Produtos: ", ex.Message));
			}
		}
	}
}