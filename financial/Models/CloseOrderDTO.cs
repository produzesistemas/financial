using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    public class CloseOrderDTO
    {
        public string PostalCode { get; set; }
        public int EstablishmentId { get; set; }
        public string Id { get; set; }

        public DeliveryRegion DeliveryRegion { get; set; }
        public Address Address { get; set; }
        public ApplicationUserDTO ApplicationUserDTO { get; set; }
        public Establishment Establishment { get; set; }
    }
}
