using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using System;
using System.Linq;
using System.Linq.Expressions;
using UnitOfWork;

namespace Repositorys
{
    public class CouponRepository : ICouponRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public CouponRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Coupon Get(int id)
        {
            return _context.Coupon.FirstOrDefault(x => x.Id == id);
        }

        public IQueryable<Coupon> Where(Expression<Func<Coupon, bool>> expression)
        {
           return  _context.Coupon.Where(expression).AsQueryable();
        }

        public IQueryable<Coupon> GetAll()
        {
            return _context.Coupon.AsQueryable();
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

        public void Delete(int id)
        {
            var entity = _context.Coupon.FirstOrDefault(x => x.Id == id);
            _context.Remove(entity);
            _context.SaveChanges();
        }

        public void Update(Coupon entity)
        {
            if (_context.Coupon.Any(x => x.Main == true) && entity.Main == true)
            {
                throw new Exception("Já existe um cupom cadastrado que será utilizado na página principal");
            }
            var entityBase = _context.Coupon.FirstOrDefault(x => x.Id == entity.Id);
            entityBase.Description = entity.Description;
            entityBase.UpdateDate = DateTime.Now;
            entityBase.Code = entity.Code;
            entityBase.InitialDate = entity.InitialDate;
            entityBase.FinalDate = entity.FinalDate;
            entityBase.General = entity.General;
            entityBase.Main = entity.Main;
            entityBase.Quantity = entity.Quantity;
            entityBase.Type = entity.Type;
            entityBase.Value = entity.Value;
            entityBase.MinimumValue = entity.MinimumValue;
            if (entity.ClientId != null)
            {
                entityBase.ClientId = entity.ClientId;
            }
            _context.Entry(entityBase).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Insert(Coupon entity)
        {
            if (_context.Coupon.Any(x => x.Main == true) && entity.Main == true)
            {
                throw new Exception("Já existe um cupom cadastrado que será utilizado na página principal");
            }
            _context.Coupon.Add(entity);
            _context.SaveChanges();
        }

        public void Active(int id)
        {
            var entity = _context.Coupon.FirstOrDefault(x => x.Id == id);
            if (entity.Active)
            {
                entity.Active = false;
            }
            else
            {
                entity.Active = true;
            }
            _context.Entry(entity).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public Coupon Check(int id, string applicationUserId)
        {
            var cupom = _context.Coupon.FirstOrDefault(x => x.Id == id);
            if (!cupom.Active)
            {
                throw new Exception("Cupom expirado!");
            }
            if (!cupom.General)
            {
                if (cupom.ClientId != applicationUserId)
                {
                    throw new Exception("Esse cupom pertence a outro usuário!");
                }
            }
            if ((DateTime.Now.Date >= cupom.InitialDate.Date) && (DateTime.Now.Date <= cupom.FinalDate.Date))
            {
                return cupom;
            }
            else
            {
                throw new Exception("Cupom expirado!");
            }

        }
    }
}
