using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("Address")]
    public class Address : BaseEntity
    {
        public string ApplicationUserId { get; set; }
        public string Street { get; set; }
        public string Reference { get; set; }
        public string PostalCode { get; set; }
        public string District { get; set; }
        public string City { get; set; }
        public string Uf { get; set; }

        [NotMapped]
        public int EstablishmentId { get; set; }

    }
}
