using Models;
using System;
using System.Linq;
using UnitOfWork;

namespace Repositorys
{
    public class CategoryDTORepository : ICategoryDTORepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public CategoryDTORepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public CategoryDTO Get(CategoryDTO filter)
        {
            var categoryDTO = new CategoryDTO();
			categoryDTO.Categorys = _context.Category.Where(
                x => x.EstablishmentId == filter.EstablishmentId &&
                x.Active == true);
			categoryDTO.ImageName = _context.Establishment.FirstOrDefault(x => x.Id == filter.EstablishmentId).ImageName;
            categoryDTO.OpeningHours = _context.OpeningHours.Where(
                x => x.EstablishmentId == filter.EstablishmentId &&
                x.Active == true);
            return categoryDTO;
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

     
    }
}