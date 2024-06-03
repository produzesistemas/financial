using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{
    [Table("DeliveryRegion")]

    public class DeliveryRegion : BaseEntity
    {
        public string PostalCode { get; set; }
        public int EstablishmentId { get; set; }
        public string ApplicationUserId { get; set; }
        public bool Active { get; set; } = true;
        public decimal? Value { get; set; }
    }
}
