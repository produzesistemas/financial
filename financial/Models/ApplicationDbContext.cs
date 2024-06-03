using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Establishment>().HasKey(c => c.Id);
            modelBuilder.Entity<Establishment>().HasOne(c => c.Module);
            modelBuilder.Entity<Establishment>().HasOne(c => c.ApplicationUser);
            modelBuilder.Entity<Establishment>().HasMany(c => c.OpeningHours)
                .WithOne(b => b.Establishment)
                .HasForeignKey(c => c.EstablishmentId);

            modelBuilder.Entity<Category>().HasKey(c => c.Id);

            modelBuilder.Entity<DeliveryRegion>().HasKey(c => c.Id);

            modelBuilder.Entity<Address>().HasKey(c => c.Id);

            modelBuilder.Entity<DelicatessenOrder>().HasKey(c => c.Id);
            modelBuilder.Entity<DelicatessenOrder>().HasOne(c => c.Address);
            modelBuilder.Entity<DelicatessenOrder>().HasOne(c => c.Coupon);
            modelBuilder.Entity<DelicatessenOrder>().HasOne(c => c.Establishment);
            modelBuilder.Entity<DelicatessenOrder>().HasOne(c => c.EstablishmentBrandCredit);
            modelBuilder.Entity<DelicatessenOrder>().HasOne(c => c.EstablishmentBrandDebit);
            modelBuilder.Entity<DelicatessenOrder>().HasOne(c => c.ApplicationUser);
            modelBuilder.Entity<DelicatessenOrder>().HasOne(c => c.PaymentCondition);
            modelBuilder.Entity<DelicatessenOrderProduct>().HasOne(c => c.DelicatessenProduct);
			modelBuilder.Entity<DelicatessenOrderTracking>().HasOne(c => c.StatusOrder);
            modelBuilder.Entity<DelicatessenOrder>().HasMany(c => c.DelicatessenOrderProducts)
                .WithOne(b => b.DelicatessenOrder)
                .HasForeignKey(c => c.DelicatessenOrderId);


            modelBuilder.Entity<DelicatessenOrder>().HasMany(c => c.DelicatessenOrderEmails)
                .WithOne(b => b.DelicatessenOrder)
                .HasForeignKey(c => c.DelicatessenOrderId);
            modelBuilder.Entity<DelicatessenOrder>().HasMany(c => c.DelicatessenOrderTrackings)
                .WithOne(b => b.DelicatessenOrder)
                .HasForeignKey(c => c.DelicatessenOrderId);

			modelBuilder.Entity<DelicatessenOrderTracking>().HasKey(c => c.Id);
            modelBuilder.Entity<DelicatessenOrderEmail>().HasKey(c => c.Id);

            modelBuilder.Entity<StatusOrder>().HasKey(c => c.Id);
            modelBuilder.Entity<DelicatessenProduct>().HasKey(c => c.Id);
            modelBuilder.Entity<DelicatessenProduct>().HasOne(c => c.Category);

            modelBuilder.Entity<Module>().HasKey(c => c.Id);
            modelBuilder.Entity<Module>().HasMany(c => c.AspNetUserModules)
                .WithOne(b => b.Module)
                .HasForeignKey(c => c.ModuleId);

            modelBuilder.Entity<AspNetUserCode>().HasKey(c => c.Id);

            modelBuilder.Entity<Subscription>().HasKey(c => c.Id);
            modelBuilder.Entity<Subscription>().HasOne(c => c.Plan);
            modelBuilder.Entity<Subscription>().HasOne(c => c.Establishment);

            modelBuilder.Entity<Plan>().HasKey(c => c.Id);
            modelBuilder.Entity<Log>().HasKey(c => c.Id);
            modelBuilder.Entity<Log>().HasOne(c => c.ApplicationUser);
            modelBuilder.Entity<OpeningHours>().HasKey(c => c.Id);

            modelBuilder.Entity<Brand>().HasKey(c => c.Id);
            modelBuilder.Entity<EstablishmentBrandDebit>().HasKey(c => c.Id);
            modelBuilder.Entity<EstablishmentBrandDebit>().HasOne(c => c.Brand);
            modelBuilder.Entity<EstablishmentBrandCredit>().HasKey(c => c.Id);
            modelBuilder.Entity<EstablishmentBrandCredit>().HasOne(c => c.Brand);

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<ApplicationUser> ApplicationUser { get; set; }
        public DbSet<Establishment> Establishment { get; set; }
        public DbSet<AspNetUserCode> AspNetUserCode { get; set; }
        public DbSet<Log> Log { get; set; }
        public DbSet<PaymentCondition> PaymentCondition { get; set; }
        public DbSet<Plan> Plan { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<DeliveryRegion> DeliveryRegion { get; set; }
        public DbSet<DelicatessenProduct> DelicatessenProduct { get; set; }
        public DbSet<Module> Module { get; set; }
        public DbSet<Subscription> Subscription { get; set; }
        public DbSet<OpeningHours> OpeningHours { get; set; }
        public DbSet<Coupon> Coupon { get; set; }
        public DbSet<StatusOrder> StatusOrder { get; set; }
        public DbSet<DelicatessenOrder> DelicatessenOrder { get; set; }
        public DbSet<DelicatessenOrderTracking> DelicatessenOrderTracking { get; set; }
        public DbSet<DelicatessenOrderProduct> DelicatessenOrderProduct { get; set; }
        public DbSet<DelicatessenOrderEmail> DelicatessenOrderEmail { get; set; }
        public DbSet<Address> Address { get; set; }
        public DbSet<Brand> Brand { get; set; }
        public DbSet<EstablishmentBrandCredit> EstablishmentBrandCredit { get; set; }
        public DbSet<EstablishmentBrandDebit> EstablishmentBrandDebit { get; set; }

    }
}
