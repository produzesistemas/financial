using Castle.Core.Internal;
using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Models;
using Newtonsoft.Json;
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
    public class DelicatessenProductController : ControllerBase
    {
        private IWebHostEnvironment _hostEnvironment;
        private IConfiguration _configuration;
        private IDelicatessenProductRepository _DelicatessenProductRepository;
        

        public DelicatessenProductController(
            IWebHostEnvironment environment,
            IConfiguration Configuration,
            IDelicatessenProductRepository DelicatessenProductRepository)
        {
            _hostEnvironment = environment;
            _configuration = Configuration;
            _DelicatessenProductRepository = DelicatessenProductRepository;
            
        }

        [HttpPost()]
        [Route("filter")]
        [Authorize()]
        public IActionResult GetByFilter(DelicatessenProduct filter)
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
                Expression<Func<DelicatessenProduct, bool>> p1, p2, p3;
                var predicate = PredicateBuilder.New<DelicatessenProduct>();
                if (filter.Description != null)
                {
                    p1 = p => p.Description.Contains(filter.Description);
                    predicate = predicate.And(p1);
                }

                if (filter.CategoryId > 0)
                {
                    p2 = p => p.CategoryId == filter.CategoryId;
                    predicate = predicate.And(p2);
                }

                p3 = p => p.EstablishmentId == establishmentId;
                predicate = predicate.And(p3);
                return new JsonResult(_DelicatessenProductRepository.Where(predicate));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Produtos: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("save")]
        [Authorize()]
        public IActionResult Save()
        {
            try
            {
                var delicatessenProduct = JsonConvert.DeserializeObject<DelicatessenProduct>(Convert.ToString(Request.Form["delicatessenProduct"]));
                var pathToSave = string.Concat(_hostEnvironment.ContentRootPath, _configuration["pathFileProduct"]);
                var fileDelete = pathToSave;
                var files = Request.Form.Files;
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
                if (delicatessenProduct.Id == decimal.Zero)
                {
                    delicatessenProduct.Active = true;
                    delicatessenProduct.ApplicationUserId = id;
                    delicatessenProduct.CreateDate = DateTime.Now;
                    delicatessenProduct.EstablishmentId = establishmentId;

                        var extension = Path.GetExtension(files[0].FileName);
                        var fileName = string.Concat(Guid.NewGuid().ToString(), extension);
                        var fullPath = Path.Combine(pathToSave, fileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            files[0].CopyTo(stream);
                        delicatessenProduct.ImageName = fileName;
                        }
                    _DelicatessenProductRepository.Insert(delicatessenProduct);
                }
                else
                {
                    delicatessenProduct.UpdateApplicationUserId = id;
                    delicatessenProduct.UpdateDate = DateTime.Now;

                    if (files.Count() > decimal.Zero)
                    {
                        var extension = Path.GetExtension(files[0].FileName);
                        var fileName = string.Concat(Guid.NewGuid().ToString(), extension);
                        var fullPath = Path.Combine(pathToSave, fileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            files[0].CopyTo(stream);
                            delicatessenProduct.ImageName = fileName;
                        }
                    }
                    _DelicatessenProductRepository.Update(delicatessenProduct, pathToSave, files);
                }

                return new JsonResult(delicatessenProduct);
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no cadastro do produto!", " - ", ex.InnerException));
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                return new JsonResult(_DelicatessenProductRepository.Get(id));
            }
            catch (Exception ex)
            {
                return BadRequest("Produto não encontrado!");
            }
        }

        [HttpPost()]
        [Route("delete")]
        [Authorize()]
        public IActionResult Delete(DelicatessenProduct delicatessenProduct)
        {
            try
            {
                var pathToSave = string.Concat(_hostEnvironment.ContentRootPath, _configuration["pathFileProduct"]);
                _DelicatessenProductRepository.Delete(delicatessenProduct.Id, pathToSave);
                return new OkResult();
            }
            catch (Exception ex)
            {
                if (ex.InnerException.Message.Contains("The DELETE statement conflicted with the REFERENCE constraint"))
                {
                    return BadRequest("O produto não pode ser excluído. Foi encontrada movimentação. Considere desativar!");
                }
                return BadRequest(ex.Message);
            }
        }

        [HttpPost()]
        [Route("active")]
        [Authorize()]
        public IActionResult Active(DelicatessenProduct delicatessenProduct)
        {
            try
            {
                _DelicatessenProductRepository.Active(delicatessenProduct.Id);
                return new OkResult();
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }

        [HttpPost()]
        [Route("getByCategory")]
        public IActionResult GetByCategory(DelicatessenProduct filter)
        {
            try
            {
                Expression<Func<DelicatessenProduct, bool>> p1, p2, p3;
                var predicate = PredicateBuilder.New<DelicatessenProduct>();
                if ((filter.CategoryId == decimal.Zero) || (filter.EstablishmentId == decimal.Zero))
                {
                    return BadRequest("Categoria não encontrada!");
                } 

                    p1 = p => p.CategoryId == filter.CategoryId;
                    predicate = predicate.And(p1);

                    p2 = p => p.Active == true;
                    predicate = predicate.And(p2);

                    p3 = p => p.EstablishmentId == filter.EstablishmentId;
                    predicate = predicate.And(p3);
                return new JsonResult(_DelicatessenProductRepository.Where(predicate));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Produtos: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("getByDescription")]
        public IActionResult GetByDescription(DelicatessenProduct filter)
        {
            try
            {
                if (filter.Description.IsNullOrEmpty())
                {
                    return BadRequest("Descrição não encontrada.");
                }
                if (filter.EstablishmentId == decimal.Zero)
                {
                    return BadRequest("Identificação do Estabelecimento não encontrada.");
                }
                Expression<Func<DelicatessenProduct, bool>> p1, p2, p3;
                var predicate = PredicateBuilder.New<DelicatessenProduct>();
                p1 = p => p.Description.ToUpper().Contains(filter.Description.ToUpper());
                predicate = predicate.And(p1);
                p2 = p => p.Active == true;
                predicate = predicate.And(p2);
                p3 = p => p.EstablishmentId == filter.EstablishmentId;
                predicate = predicate.And(p3);
                return new JsonResult(_DelicatessenProductRepository.Where(predicate));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Produtos: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("getPromotions")]
        public IActionResult GetPromotions(DelicatessenProduct filter)
        {
            try
            {
                if (filter.EstablishmentId == decimal.Zero)
                {
                    return BadRequest("Identificação do Estabelecimento não encontrada.");
                }
                Expression<Func<DelicatessenProduct, bool>> p1, p2, p3;
                var predicate = PredicateBuilder.New<DelicatessenProduct>();
                p1 = p => p.Promotion == true;
                predicate = predicate.And(p1);
                p2 = p => p.Active == true;
                predicate = predicate.And(p2);
                p3 = p => p.EstablishmentId == filter.EstablishmentId;
                predicate = predicate.And(p3);
                return new JsonResult(_DelicatessenProductRepository.Where(predicate));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Produtos: ", ex.Message));
            }
        }

        [HttpPost()]
        [Route("getByEstablishment")]
        public IActionResult GetByEstablishment(DelicatessenProduct filter)
        {
            try
            {
                Expression<Func<DelicatessenProduct, bool>> p1;
                var predicate = PredicateBuilder.New<DelicatessenProduct>();
                    p1 = p => p.EstablishmentId == filter.EstablishmentId && p.Active == true;
                    predicate = predicate.And(p1);
                return new JsonResult(_DelicatessenProductRepository.Where(predicate));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Produtos: ", ex.Message));
            }
        }


    }
}