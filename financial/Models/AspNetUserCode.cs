using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("AspNetUserCode")]
    public class AspNetUserCode : BaseEntity
    {
        public string UserId { get; set; }
        public string Code { get; set; }

        [NotMapped]
        public virtual ApplicationUserDTO ApplicationUserDTO { get; set; }

    }
}
