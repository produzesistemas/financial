using LinqKit;
using Microsoft.EntityFrameworkCore;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using UnitOfWork;

namespace Repositorys
{
    public class EstablishmentBrandCreditRepository : IEstablishmentBrandCreditRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public EstablishmentBrandCreditRepository(ApplicationDbContext context)
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

        public EstablishmentBrandCredit Get(int id)
        {
            throw new NotImplementedException();
        }

        public IQueryable<EstablishmentBrandCredit> Where(Expression<Func<EstablishmentBrandCredit, bool>> expression)
        {
            return _context.EstablishmentBrandCredit.Include(x => x.Brand)
                .Where(expression)
                .AsQueryable();
        }

        public void Insert(EstablishmentBrandCredit establishmentBrandCredit)
        {
            if (establishmentBrandCredit.Id == decimal.Zero)
            {
                _context.EstablishmentBrandCredit.Add(establishmentBrandCredit);
            }
            else
            {
                var entityBase = _context.EstablishmentBrandCredit.FirstOrDefault(x => x.Id == establishmentBrandCredit.Id);
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
