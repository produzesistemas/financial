using Microsoft.AspNetCore.Http;
using Models;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace UnitOfWork
{
    public interface IEstablishmentBrandDebitRepository : IDisposable
    {
        IQueryable<EstablishmentBrandDebit> Where(Expression<Func<EstablishmentBrandDebit, bool>> expression);
        void Insert(EstablishmentBrandDebit establishmentBrandDebit);
    }
}
