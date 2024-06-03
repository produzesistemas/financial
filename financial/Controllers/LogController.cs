using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Filters;
using System;
using System.Linq.Expressions;
using UnitOfWork;

namespace financial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogController : ControllerBase
    {
        private ILogRepository _LogRepository;

        public LogController(
   ILogRepository LogRepository
    )
        {
            _LogRepository = LogRepository;
        }

        [HttpPost()]
        [Route("filter")]
        [Authorize()]
        public IActionResult GetByFilter(FilterDefault filter)
        {
            try
            {
                Expression<Func<Log, bool>> p1, p2, p3;
                var predicate = PredicateBuilder.New<Log>();
                if (filter.Search != null)
                {
                    p1 = p => p.Description.Contains(filter.Search);
                    predicate = predicate.And(p1);
                }
                if (filter.Type.HasValue)
                {
                    p2 = p => p.Type == filter.Type.Value;
                    predicate = predicate.And(p2);
                }
                if (filter.CreateDate.HasValue)
                {
                    p3 = p => p.CreateDate == filter.CreateDate.Value;
                    predicate = predicate.And(p3);
                }
                return new JsonResult(_LogRepository.Where(predicate));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Horários de funcionamento: ", ex.Message));
            }
        }

    }
}