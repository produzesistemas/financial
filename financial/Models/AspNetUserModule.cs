using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("AspNetUserModule")]
    public class AspNetUserModule : BaseEntity
    {
        public string ApplicationUserId { get; set; }
        public int ModuleId { get; set; }

        [NotMapped]
        public ApplicationUser ApplicationUser { get; set; }

        [NotMapped]
        public virtual Module Module { get; set; }
    }
}