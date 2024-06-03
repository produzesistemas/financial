using Microsoft.AspNetCore.Http;
using Models;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace UnitOfWork
{
    public interface IEstablishmentBrandCreditRepository : IDisposable
    {
        IQueryable<EstablishmentBrandCredit> Where(Expression<Func<EstablishmentBrandCredit, bool>> expression);
        void Insert(EstablishmentBrandCredit establishmentBrandCredit);
    }
}
