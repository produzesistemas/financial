using Models;
using UnitOfWork;
using System;
using System.Linq;

namespace Repositorys
{
    public class CloseOrderDTORepository : ICloseOrderDTORepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public CloseOrderDTORepository(ApplicationDbContext context)
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

        public CloseOrderDTO Get(CloseOrderDTO closeOrderDTO)
        {
            var c = new CloseOrderDTO();
            c.DeliveryRegion = _context.DeliveryRegion.FirstOrDefault(x => x.Active == true &&
            x.PostalCode.Equals(closeOrderDTO.PostalCode) &&
            x.EstablishmentId.Equals(closeOrderDTO.EstablishmentId));
            c.ApplicationUserDTO = _context.Users.Where(x => x.Id.Equals(closeOrderDTO.Id))
                .Select(cl => new ApplicationUserDTO
                {
                     Cpf = cl.Cpf, Name = cl.Name, Phone = cl.PhoneNumber
                }).FirstOrDefault();
            c.Address = _context.Address.FirstOrDefault(x => x.ApplicationUserId == closeOrderDTO.Id && x.PostalCode == closeOrderDTO.PostalCode);
            c.Establishment = _context.Establishment.FirstOrDefault(x => x.Id == closeOrderDTO.EstablishmentId);
            return c;
        }
    }
}
