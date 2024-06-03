using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("DelicatessenProduct")]
    public class DelicatessenProduct : BaseEntity
    {
        public string ImageName { get; set; }
        public string Description { get; set; }
        public string Detail { get; set; }
        public string Code { get; set; }
        public int CategoryId { get; set; }
        public bool Active { get; set; }
        public bool Promotion { get; set; }
        public decimal Value { get; set; }
        public decimal? PromotionValue { get; set; }
        public string UpdateApplicationUserId { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public int EstablishmentId { get; set; }
        public string ApplicationUserId { get; set; }

        [NotMapped]
        public string CriadoPor { get; set; }
        [NotMapped]
        public string AlteradoPor { get; set; }
        [NotMapped]
        public virtual Category Category { get; set; }

        [NotMapped]
        public string imagemBase64 { get; set; }
        public DelicatessenProduct()
        {
        }
    }
}
