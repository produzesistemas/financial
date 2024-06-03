using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Models;
using Models.Filters;
using Newtonsoft.Json;
using Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Mail;
using System.Security.Claims;
using System.Threading.Tasks;
using UnitOfWork;

namespace financial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private IConfiguration _configuration;
        private IWebHostEnvironment _hostEnvironment;
        private IModuleRepository _moduleRepository;
        private IEstablishmentRepository _establishmentRepository;
        private IAspNetUserCodeRepository _aspNetUserCodeRepository;
        private IApplicationUserRepository _applicationUserRepository;
        public AccountController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEstablishmentRepository establishmentRepository,
            IAspNetUserCodeRepository aspNetUserCodeRepository,
            IApplicationUserRepository applicationUserRepository,
            IWebHostEnvironment environment,
            IModuleRepository moduleRepository,
            IConfiguration configuration)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._hostEnvironment = environment;
            this._configuration = configuration;
            this._moduleRepository = moduleRepository;
            this._establishmentRepository = establishmentRepository;
            this._aspNetUserCodeRepository = aspNetUserCodeRepository;
            this._applicationUserRepository = applicationUserRepository;
        }

        [HttpPost()]
        [Route("filter")]
        [Authorize()]
        public IActionResult GetByFilter(FilterDefault filter)
        {
            try
            {
                Expression<Func<Establishment, bool>> p1, p2, p3;
                var predicate = PredicateBuilder.New<Establishment>();
                if (filter.EstablishmentId.HasValue || filter.Email != null)
                {
                    if (filter.Search != null)
                    {
                        p2 = p => p.ApplicationUser.Email.Contains(filter.Email);
                        predicate = predicate.And(p2);
                    }

                    return new JsonResult(_establishmentRepository.Where(predicate));
                }

                return new JsonResult(_establishmentRepository.GetAll());
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos usuários: ", ex.Message));
            }
        }

        [HttpPost()]
        [AllowAnonymous]
        [Route("loginAdministrator")]
        public async Task<IActionResult> LoginAdministrator(LoginUser loginUser)
        {
            try
            {
                var result = await _signInManager.PasswordSignInAsync(loginUser.Email.Split("@").FirstOrDefault(), loginUser.Secret, false, false);
                if (!result.Succeeded)
                {
                    return BadRequest("Acesso negado! Login inválido ou conta não confirmada!");
                }
                var user = await _userManager.FindByEmailAsync(loginUser.Email);
                if (!user.Provider.Equals("Administrador"))
                {
                    return BadRequest("Acesso negado! Usuário não é administrador!");
                }

                var applicationUser = new ApplicationUser();
                applicationUser.Id = user.Id;
                var applicationUserDTO = new ApplicationUserDTO();
                applicationUserDTO.Token = TokenService.GenerateToken(applicationUser, _configuration, user.Provider, 0);
                applicationUserDTO.Email = user.Email;
                applicationUserDTO.Role = user.Provider;
                return new JsonResult(applicationUserDTO);
            }
            catch (Exception ex)
            {
                return BadRequest("Falha no login! " + ex.Message);
            }
        }

        [HttpPost()]
        [AllowAnonymous]
        [Route("loginPartner")]
        public async Task<IActionResult> LoginPartner(LoginUser loginUser)
        {
            try
            {
                var result = await _signInManager.PasswordSignInAsync(loginUser.Email.Split("@").FirstOrDefault(), loginUser.Secret, false, false);
                if (!result.Succeeded)
                {
                    return BadRequest("Acesso negado! Login inválido ou conta não confirmada!");
                }
                var user = await _userManager.FindByEmailAsync(loginUser.Email);
                var establishment = _establishmentRepository.GetByOwner(user.Id);
                if (establishment == null)
                {
                    return BadRequest("Acesso negado! Usuário não tem módulo!");
                }
                if (establishment.Subscriptions.Count() == decimal.Zero)
                {
                    return BadRequest("Acesso negado! Usuário não tem Assinatura!");
                }

                var applicationUser = new ApplicationUser();
                applicationUser.Id = user.Id;
                var applicationUserDTO = new ApplicationUserDTO();
                applicationUserDTO.Email = user.Email;
                applicationUserDTO.Token = TokenService.GenerateToken(applicationUser, _configuration, establishment.Module.Description, establishment.Id);
                applicationUserDTO.Establishment = establishment.Name;
                applicationUserDTO.Role = establishment.Module.Description;
                var actualDate = DateTime.Now;

                if (establishment.Subscriptions.FirstOrDefault().Plan.QtdMonth == 0)
                {
                    applicationUserDTO.SubscriptionDate = establishment.Subscriptions.FirstOrDefault().SubscriptionDate.AddDays(15);
                }
                else
                {
                    applicationUserDTO.SubscriptionDate = establishment.Subscriptions
                        .FirstOrDefault().SubscriptionDate
                        .AddMonths(establishment.Subscriptions.FirstOrDefault().Plan.QtdMonth)
                        .AddDays(establishment.Subscriptions.FirstOrDefault().Tolerance)
                        .Date;

                }

                if (applicationUserDTO.SubscriptionDate.Date < DateTime.Now.Date)
                {
                    return StatusCode(StatusCodes.Status423Locked, new { message = "Assinatura expirou" });
                }

                return new JsonResult(applicationUserDTO);
            }
            catch (Exception ex)
            {
                return BadRequest("Falha no login! " + ex.Message);
            }
        }

        [HttpPost()]
        [Route("changePassword")]
        [Authorize()]
        public async Task<IActionResult> ChangePassword(LoginUser loginUser)
        {
            ClaimsPrincipal currentUser = this.User;
            var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
            if (id == null)
            {
                return BadRequest("Identificação do usuário não encontrada.");
            }
            var user = await _userManager.FindByIdAsync(id);
            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, loginUser.Secret);
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                if (result.Errors.FirstOrDefault().Code.Equals("PasswordTooShort")) { return BadRequest("A senha deve ter no mínimo 6 caracteres"); }
                return BadRequest(result.Errors.FirstOrDefault().ToString());
            }

        }

        [HttpGet()]
        [Route("getModules")]
        public IActionResult GetModules()
        {
            var modules = new List<Module>();
            _moduleRepository.GetAll().ForEach(x =>
            {
                if (x.Id > 2)
                {
                    modules.Add(x);
                }
            });

            return new JsonResult(modules);
        }

        [HttpPost()]
        [Route("recoverPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> RecoverPassword(LoginUser loginUser)
        {
            try
            {
                if ((loginUser == null) || (loginUser.Email == null))
                {
                    return BadRequest("E-mail inválido.");
                }
                var user = await _userManager.FindByEmailAsync(loginUser.Email);
                if (user == null)
                {
                    return BadRequest("E-mail não encontrado.");
                }

                var pass = GeneratePassword.RandomPassword();
                user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, pass);
                user.EmailConfirmed = false;
                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    var code = Guid.NewGuid().ToString();
                    await _userManager.AddClaimAsync(user, new Claim("CodeConfirmation", code));
                    sendEmailConfirmUserByAdm(loginUser.Email, code, user.Id, pass);
                }
                else
                {
                    if (result.Errors.FirstOrDefault().Code.Equals("PasswordTooShort")) { return BadRequest("A senha deve ter no mínimo 6 caracteres"); }
                    if (result.Errors.FirstOrDefault().Code.Equals("InvalidEmail")) { return BadRequest("E-mail inválido!"); }
                    if (result.Errors.FirstOrDefault().Code.Equals("InvalidUserName")) { return BadRequest("Nome do usuário inválido. Use apenas letras e números."); }
                    return BadRequest(result.Errors.FirstOrDefault().ToString());
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost()]
        [AllowAnonymous]
        [Route("userConfirm")]
        public async Task<IActionResult> UserConfirmByAdm(LoginUser loginUser)
        {
            try
            {
                var applicationUser = await _userManager.FindByIdAsync(loginUser.ApplicationUserId);
                if (applicationUser == null)
                {
                    return BadRequest("Usuário não encontrado.");
                }


                var claims = await _userManager.GetClaimsAsync(applicationUser);
                if (!claims.Any(c => c.Value == loginUser.Code))
                {
                    return BadRequest("Código não encontrado.");
                }

                if ((claims.Any(c => c.Value == loginUser.Code)) && (applicationUser.EmailConfirmed))
                {
                    return BadRequest("Email já confirmado. Efetue o login");
                }

                applicationUser.EmailConfirmed = true;
                await _userManager.UpdateAsync(applicationUser);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha na validação do usuário", ex.Message));
            }
        }

        // Método para o usuário fazer login no app
        [HttpPost()]
        [AllowAnonymous]
        [Route("loginByCode")]
        public async Task<IActionResult> LoginByCode(LoginUser loginUser)
        {
            try
            {
                if (loginUser.Code == null)
                {
                    return BadRequest("Obrigatório informar código");
                }
                var aspNetUserCode = _aspNetUserCodeRepository.Get(loginUser.Code);
                if (aspNetUserCode == null)
                {
                    return BadRequest("Código inválido.");
                }
                var user = await _userManager.FindByIdAsync(aspNetUserCode.UserId);
                if (user == null)
                {
                    return BadRequest("Usuário inválido.");
                }
                if (loginUser.Email != user.Email)
                {
                    return BadRequest("O código informado não pertence ao usuário.");
                }
                var applicationUser = new ApplicationUser();
                applicationUser.Id = user.Id;
                var applicationUserDTO = new ApplicationUserDTO();
                applicationUserDTO.Email = user.Email;
                applicationUserDTO.Token = TokenService.GenerateToken(applicationUser, _configuration, null, 0);
                applicationUserDTO.Name = user.UserName;
                applicationUserDTO.Phone = user.PhoneNumber;
                return new JsonResult(applicationUserDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha na validação do usuário", ex.Message));
            }
        }

        //Método para registrar o parceiro no site pelo Adm
        [HttpPost()]
        [AllowAnonymous]
        [Route("registerPartnerByAdm")]
        public async Task<IActionResult> RegisterByAdm()
        {
            try
            {
                var establishment = JsonConvert.DeserializeObject<Establishment>(Convert.ToString(Request.Form["establishment"]));
                var pathToSave = string.Concat(_hostEnvironment.ContentRootPath, _configuration["pathFileEstablishment"]);
                var fileDelete = pathToSave;
                var files = Request.Form.Files;

                var applicationUser = this._userManager.FindByEmailAsync(establishment.Email);
                if (applicationUser.Result != null)
                {
                    return BadRequest("Usuário já registrado. Verifique sua caixa de email e confirme o cadastro ou recupere sua senha.");
                }

                var user = new ApplicationUser()
                {
                    UserName = establishment.Email.Split("@").FirstOrDefault(),
                    Email = establishment.Email,
                    EmailConfirmed = false,
                    PhoneNumberConfirmed = false,
                    TwoFactorEnabled = false,
                    LockoutEnabled = true,
                    AccessFailedCount = Convert.ToInt32(decimal.Zero)
                };

                var pass = GeneratePassword.RandomPassword();
                user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, pass);
                IdentityResult addUserResult = await _userManager.CreateAsync(user, pass);

                if (addUserResult.Succeeded)
                {
                    var extension = Path.GetExtension(files[0].FileName);
                    var fileName = string.Concat(Guid.NewGuid().ToString(), ".jpg");
                    establishment.ImageName = fileName;
                    var fullPath = Path.Combine(pathToSave, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        files[0].CopyTo(stream);
                    }
                    establishment.Active = true;
                    establishment.ApplicationUserId = user.Id;
                    _establishmentRepository.Insert(establishment);

                    var code = Guid.NewGuid().ToString();
                    _aspNetUserCodeRepository.Insert(
                        new AspNetUserCode()
                        {
                            Code = code,
                            UserId = user.Id,
                        });
                    sendEmailConfirmUserByAdm(establishment.Email, code, user.Id, pass);
                }
                else
                {
                    if (addUserResult.Errors.FirstOrDefault().Code.Equals("PasswordTooShort")) { return BadRequest("A senha deve ter no mínimo 6 caracteres"); }
                    if (addUserResult.Errors.FirstOrDefault().Code.Equals("InvalidEmail")) { return BadRequest("E-mail inválido!"); }
                    if (addUserResult.Errors.FirstOrDefault().Code.Equals("InvalidUserName")) { return BadRequest("Nome do usuário inválido. Use apenas letras e números."); }
                    return BadRequest(addUserResult.Errors.FirstOrDefault().ToString());
                }

                return new JsonResult("Usuário registrado com sucesso! Verifique sua caixa de email e confirme o cadastro.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException);
            }
        }

        // Método para registrar e receber código do cliente no app
        [HttpPost()]
        [AllowAnonymous]
        [Route("registerClientByEmail")]
        public async Task<IActionResult> RegisterClientByEmail(LoginUser loginUser)
        {
            try
            {
                if (loginUser.Email == null)
                {
                    return BadRequest("Obrigatório informar e-mail");
                }

                var applicationUser = await _userManager.FindByEmailAsync(loginUser.Email);
                if (applicationUser != null)
                {
                    var code = GeneratePassword.RandomNumber(1000, 9999);
                    _aspNetUserCodeRepository.Insert(
                                            new AspNetUserCode()
                                            {
                                                Code = code.ToString(),
                                                UserId = applicationUser.Id,
                                            });
                    sendEmailConfirmUser(loginUser.Email, code.ToString());
                }
                else
                {
                    var user = new ApplicationUser()
                    {
                        UserName = loginUser.Email.Split("@").FirstOrDefault(),
                        Email = loginUser.Email,
                        EmailConfirmed = true,
                        PhoneNumberConfirmed = false,
                        TwoFactorEnabled = false,
                        LockoutEnabled = true,
                        AccessFailedCount = Convert.ToInt32(decimal.Zero)
                    };

                    var pass = GeneratePassword.RandomPassword();
                    user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, pass);
                    IdentityResult addUserResult = await _userManager.CreateAsync(user, pass);
                    var code = GeneratePassword.RandomNumber(1000, 9999);
                    if (addUserResult.Succeeded)
                    {
                        _aspNetUserCodeRepository.Insert(
                                                new AspNetUserCode()
                                                {
                                                    Code = code.ToString(),
                                                    UserId = user.Id,
                                                });
                        sendEmailConfirmUser(loginUser.Email, code.ToString());
                    }
                    else
                    {
                        if (addUserResult.Errors.FirstOrDefault().Code.Equals("PasswordTooShort")) { return BadRequest("A senha deve ter no mínimo 6 caracteres"); }
                        if (addUserResult.Errors.FirstOrDefault().Code.Equals("InvalidEmail")) { return BadRequest("E-mail inválido!"); }
                        if (addUserResult.Errors.FirstOrDefault().Code.Equals("InvalidUserName")) { return BadRequest("Nome do usuário inválido. Use apenas letras e números."); }
                        return BadRequest(addUserResult.Errors.FirstOrDefault().ToString());
                    }
                }

                return new JsonResult("Código gerado com sucesso! Verifique sua caixa de email e confirme o código.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException);
            }
        }

        public void sendEmailConfirmUserByAdm(string Email, string code, string userId, string secret)
        {
            try
            {
                MailMessage mail = new MailMessage();
                mail.From = new MailAddress(_configuration["FromEmail"].ToString());
                mail.To.Add(Email);
                mail.Subject = string.Concat("A plataforma da Produze Sistemas precisa validar seu email.");
                mail.Body = "<div style='padding-top: 15px;'>Clique no link abaixo para validar seu email no site.</div>" +
                "<div><a href=" + _configuration["Dominio"].ToString() + "/user-confirm/" + userId + "/" + code + ">Clique para validar</a>" +
                "<div></div>" +
                "<div>Após a validação faça o login com seu e-mail e a senha: " + secret + "</div>";
                mail.IsBodyHtml = true;
                SmtpClient smtp = new SmtpClient(_configuration["STMPEmail"].ToString(), Convert.ToInt32(_configuration["PortEmail"].ToString()));
                smtp.Credentials = new System.Net.NetworkCredential(_configuration["UserEmail"].ToString(), _configuration["PassEmail"].ToString());
                smtp.Send(mail);
            }
            catch (SmtpFailedRecipientException ex)
            {
                throw new Exception(ex.Message);
            }
            catch (SmtpException ex)
            {
                throw new Exception(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void sendEmailConfirmUser(string Email, string code)
        {
            try
            {
                MailMessage mail = new MailMessage();
                mail.From = new MailAddress(_configuration["FromEmail"].ToString());
                mail.To.Add(Email);
                mail.Subject = string.Concat("A plataforma da Produze Sistemas precisa validar seu email.");
                mail.Body = "<div>Utilize o código para fazer login no app: " + code + "</div>";
                mail.IsBodyHtml = true;
                SmtpClient smtp = new SmtpClient(_configuration["STMPEmail"].ToString(), Convert.ToInt32(_configuration["PortEmail"].ToString()));
                smtp.Credentials = new System.Net.NetworkCredential(_configuration["UserEmail"].ToString(), _configuration["PassEmail"].ToString());
                smtp.Send(mail);
            }
            catch (SmtpFailedRecipientException ex)
            {
                var message = ex.Message;
            }
            catch (SmtpException ex)
            {
            }
            catch (Exception ex)
            {
            }
        }

        [HttpGet()]
        [Route("getClients")]
        [Authorize()]
        public IActionResult GetClients()
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var establishmentId = Convert.ToInt32(currentUser.Claims.FirstOrDefault(z => z.Type.Contains("sid")).Value);
                if (establishmentId == decimal.Zero)
                {
                    return BadRequest("Usuário sem Estabelecimento cadastrado.");
                }
                return new JsonResult(_applicationUserRepository.GetClients(establishmentId));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos clientes: ", ex.Message));
            }
        }

        [HttpPost]
        [Route("refreshToken")]
        public async Task<IActionResult> RefreshToken(LoginUser loginUser)
        {
            if (loginUser.Code == null)
            {
                return BadRequest("Acesso negado!");
            }

            var principal = TokenService.GetPrincipalFromExpiredToken(loginUser.Code, _configuration);
            if (principal == null)
            {
                return BadRequest("Acesso negado!");
            }

            var id = principal.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
            var user = await _userManager.FindByIdAsync(id);

            var applicationUser = new ApplicationUser();
            applicationUser.Id = user.Id;
            var applicationUserDTO = new ApplicationUserDTO();
            applicationUserDTO.Token = TokenService.GenerateToken(applicationUser, _configuration, null, 0);
            applicationUserDTO.Email = user.Email;
            applicationUserDTO.Name = user.UserName;
            applicationUserDTO.Phone = user.PhoneNumber;
            return new JsonResult(applicationUserDTO);
        }

        [HttpPost()]
        [Route("update")]
        [Authorize()]
        public async Task<IActionResult> Update([FromBody] LoginUser loginUser)
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }

                var user = await _userManager.FindByIdAsync(id);
                user.PhoneNumber = loginUser.Phone;
                user.Cpf = loginUser.Cpf;
                user.Name = loginUser.Name;
                await _userManager.UpdateAsync(user);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet()]
        [Route("getAccount")]
        [Authorize()]
        public async Task<IActionResult> GetAccount()
        {
            try
            {
                ClaimsPrincipal currentUser = this.User;
                var id = currentUser.Claims.FirstOrDefault(z => z.Type.Contains("primarysid")).Value;
                if (id == null)
                {
                    return BadRequest("Identificação do usuário não encontrada.");
                }
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return BadRequest("Usuário inválido.");
                }
                var applicationUserDTO = new ApplicationUserDTO();
                applicationUserDTO.Name = user.UserName;
                applicationUserDTO.Phone = user.PhoneNumber;
                applicationUserDTO.Cpf = user.Cpf;
                applicationUserDTO.Email = user.Email;
                return new JsonResult(applicationUserDTO);

            }
            catch (Exception ex)
            {
                return BadRequest(string.Concat("Falha no carregamento dos Cupons: ", ex.Message));
            }
        }

        [HttpPost()]
        [AllowAnonymous]
        [Route("registerGoogle")]
        public async Task<IActionResult> RegisterGoogle(GoogleUser googleUser)
        {
            try
            {
                var applicationUser = this._userManager.FindByEmailAsync(googleUser.Email);
                if (applicationUser.Result != null)
                {
                    if (applicationUser.Result.Provider == null)
                    {
                        return BadRequest("Usuário já registrado através do E-mail. Faça login através do e-mail ou recupere a senha.");
                    }

                    var applicationUserDTO = new ApplicationUserDTO();
                    applicationUserDTO.Token = TokenService.GenerateToken((IdentityUser)applicationUser.Result, _configuration, null, 0);
                    applicationUserDTO.Email = googleUser.Email;
                    applicationUserDTO.Name = googleUser.Name;
                    return new JsonResult(applicationUserDTO);
                }

                if (applicationUser.Result == null)
                {
                    var user = new ApplicationUser()
                    {
                        UserName = googleUser.Name,
                        Email = googleUser.Email,
                        Provider = "Google",
                        EmailConfirmed = true,
                        PhoneNumberConfirmed = false,
                        TwoFactorEnabled = false,
                        LockoutEnabled = true,
                        AccessFailedCount = Convert.ToInt32(decimal.Zero)
                    };

                    IdentityResult addUserResult = await _userManager.CreateAsync(user, "google");

                    if (addUserResult.Succeeded)
                    {
                        var applicationUserDTO = new ApplicationUserDTO();
                        applicationUserDTO.Token = TokenService.GenerateToken(user, _configuration, null, 0);
                        applicationUserDTO.Email = user.Email;
                        applicationUserDTO.Name = user.UserName;
                        return new JsonResult(applicationUserDTO);
                    }
                    else
                    {
                        if (addUserResult.Errors.FirstOrDefault().Code.Equals("InvalidEmail")) { return BadRequest("E-mail inválido!"); }
                        if (addUserResult.Errors.FirstOrDefault().Code.Equals("InvalidUserName")) { return BadRequest("Nome do usuário inválido. Use apenas letras e números."); }
                        return BadRequest(addUserResult.Errors.FirstOrDefault().ToString());
                    }
                }

                return new JsonResult("Login efetuado com sucesso!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException);
            }
        }
    }
}