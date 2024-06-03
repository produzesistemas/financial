using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{
    [Table("Module")]
    public class Module : BaseEntity
    {
        public string Description { get; set; }

        [NotMapped]
        public virtual List<AspNetUserModule> AspNetUserModules { get; set; }
    }
}
