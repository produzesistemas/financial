using LinqKit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using UnitOfWork;

namespace Repositorys
{
    public class EstablishmentBrandDebitRepository : IEstablishmentBrandDebitRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public EstablishmentBrandDebitRepository(ApplicationDbContext context)
        {
            _context = context;
        }

       

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public IQueryable<EstablishmentBrandDebit> Where(Expression<Func<EstablishmentBrandDebit, bool>> expression)
        {
            return _context.EstablishmentBrandDebit.Include(x => x.Brand)
                .Where(expression)
                .AsQueryable();
        }

        public void Insert(EstablishmentBrandDebit establishmentBrandDebit)
        {
            if (establishmentBrandDebit.Id == decimal.Zero)
            {
                _context.EstablishmentBrandDebit.Add(establishmentBrandDebit);
            } else
            {
                var entityBase = _context.EstablishmentBrandDebit.FirstOrDefault(x => x.Id == establishmentBrandDebit.Id);
                if (entityBase.Active)
                {
                    entityBase.Active = false;
                }
                else
                {
                    entityBase.Active = true;
                }
                _context.Entry(entityBase).State = EntityState.Modified;
            }
            _context.SaveChanges();
        }
    }
}
