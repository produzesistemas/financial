using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Models;
using System.Linq.Expressions;
using System.Net.Mail;
using System;
using System.Text;
using UnitOfWork;
using System.Linq;

namespace financial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private IWebHostEnvironment _hostEnvironment;
        private IDelicatessenOrderEmailRepository _DelicatessenOrderEmailRepository;
        private IConfiguration _configuration;
        public StringBuilder stringHtml = new StringBuilder();
        public EmailController(
    UserManager<ApplicationUser> userManager,
               IConfiguration Configuration,
               IDelicatessenOrderEmailRepository DelicatessenOrderEmailRepository,
                           IWebHostEnvironment environment)
        {
            this._userManager = userManager;
            _hostEnvironment = environment;
            this._DelicatessenOrderEmailRepository = DelicatessenOrderEmailRepository;
            _configuration = Configuration;
        }

        [HttpGet()]
        [AllowAnonymous]
        [Route("getDelicatessenOrder")]
        public IActionResult GetDelicatessenOrder()
        {
            try
            {
                Expression<Func<DelicatessenOrderEmail, bool>> p1;
                var predicate = PredicateBuilder.New<DelicatessenOrderEmail>();
                p1 = p => p.Send == false;
                predicate = predicate.And(p1);
                var lst = _DelicatessenOrderEmailRepository.Where(predicate).ToList();
                var pathToSave = string.Concat(_hostEnvironment.ContentRootPath, _configuration["pathFileProduct"]);

                if (lst.Count() > 0)
                {
                    lst.ForEach(delicatessenOrderEmail =>
                    {
                        //create the mail message
                        MailMessage mail = new MailMessage();

                        //set the addresses
                        mail.From = new MailAddress(_configuration["FromEmail"].ToString());
                        var cliente = _userManager.FindByIdAsync(delicatessenOrderEmail.DelicatessenOrder.ApplicationUserId).Result;

                        var e = _hostEnvironment.ContentRootPath;
                        stringHtml.Append(string.Concat("<div style='padding-top: 15px;padding-bottom: 15px;text-align: center;'><img src='" + _configuration["Dominio"].ToString() + "/assets/" + delicatessenOrderEmail.DelicatessenOrder.Establishment.Logo + "' width='140'></div>"));

                        switch (delicatessenOrderEmail.TypeEmail)
                        {
                            case 1:
                                mail.To.Add(cliente.Email);
                                mail.Subject = "Seu pedido foi enviado com sucesso.";
                                stringHtml.Append(string.Concat("<div style='padding-top: 10px;'>O pedido de no. ", delicatessenOrderEmail.DelicatessenOrderId, " foi enviado com sucesso em ", delicatessenOrderEmail.DelicatessenOrder.DelicatessenOrderTrackings.OrderByDescending(x => x.FollowupDate).FirstOrDefault().FollowupDate + "</div>"));
                                break;

                            case 2:
                                mail.To.Add(delicatessenOrderEmail.DelicatessenOrder.Establishment.ApplicationUser.Email);
                                mail.Subject = "Sua loja recebeu um novo pedido.";
                                stringHtml.Append(string.Concat("<div style='padding-top: 10px;'>O pedido de no. ", delicatessenOrderEmail.DelicatessenOrderId, " foi recebido com sucesso em ", delicatessenOrderEmail.DelicatessenOrder.DelicatessenOrderTrackings.OrderByDescending(x => x.FollowupDate).FirstOrDefault().FollowupDate + "</div>"));
                                break;

                            case 3:
                                mail.To.Add(cliente.Email);
                                mail.To.Add(delicatessenOrderEmail.DelicatessenOrder.Establishment.ApplicationUser.Email);
                                mail.Subject = "Pedido cancelado";
                                stringHtml.Append(string.Concat("<div style='padding-top: 10px;'>O pedido de no. ", delicatessenOrderEmail.DelicatessenOrderId, " foi cancelado pelo cliente em ", delicatessenOrderEmail.DelicatessenOrder.DelicatessenOrderTrackings.OrderByDescending(x => x.FollowupDate).FirstOrDefault().FollowupDate + "</div>"));
                                break;

                            case 4:
                                mail.To.Add(cliente.Email);
                                mail.Subject = "O pedido foi confirmado para entrega com sucesso.";
                                stringHtml.Append("<div></div>");
                                stringHtml.Append(string.Concat("<div style='padding-top: 10px;'>O pedido de no. ", delicatessenOrderEmail.DelicatessenOrderId, " foi confirmado para entrega com sucesso em ", delicatessenOrderEmail.DelicatessenOrder.DelicatessenOrderTrackings.OrderByDescending(x => x.FollowupDate).FirstOrDefault().FollowupDate + "</div>"));
                                stringHtml.Append("<div style='padding-top: 10px;'><h3>Aguarde a entrega do seu pedido.</h3></div>");
                                break;

                            case 5:
                                //mail.To.Add(cliente.Email);
                                //mail.To.Add(_configuration["EmailMaster"].ToString());
                                //mail.Subject = "O pedido foi cancelado pelo lojista.";
                                //stringHtml.Append("<div></div>");
                                //stringHtml.Append(string.Concat("<div style='padding-top: 10px;'>O pedido de no. ", delicatessenOrderEmail.DelicatessenOrderId, " foi cancelado pelo lojista em ", pedido.PedidoAcompanhamentos.OrderBy(x => x.Data).FirstOrDefault().Data, "</div>"));
                                //if (!pedido.Justificativa.Equals(""))
                                //{
                                //    stringHtml.Append(string.Concat("<div style='padding-top: 10px;'><h3>Justificativa: ", delicatessenOrderEmail.DelicatessenOrder.Ju, ".</h3></div>"));
                                //}
                                //stringHtml.Append("<div style='padding-top: 10px;'><h3>Caso tenha efetuado o pagamento, aguarde o estorno do valor.</h3></div>");
                                //break;

                            case 6:
                                mail.To.Add(cliente.Email);
                                mail.Subject = "O pedido de estorno foi solicitado a administradora do cartão.";
                                stringHtml.Append("<div></div>");
                                stringHtml.Append(string.Concat("<div style='padding-top: 10px;'>O pagamento do pedido de no. ", delicatessenOrderEmail.DelicatessenOrderId, " foi solicitado e estorno para a Administradora do cartão em ", delicatessenOrderEmail.DelicatessenOrder.DelicatessenOrderTrackings.OrderByDescending(x => x.FollowupDate).FirstOrDefault().FollowupDate, "</div>"));
                                stringHtml.Append("<div style='padding-top: 10px;'><h3>Aguarde o estorno no extrato do seu cartão.</h3></div>");
                                break;

                            case 7:
                                mail.To.Add(cliente.Email);
                                mail.To.Add(delicatessenOrderEmail.DelicatessenOrder.Establishment.ApplicationUser.Email);
                                mail.Subject = "O pedido foi avaliado.";
                                stringHtml.Append("<div></div>");
                                stringHtml.Append(string.Concat("<div style='padding-top: 10px;'>O pedido de no. ", delicatessenOrderEmail.DelicatessenOrderId, " foi avaliado pelo cliente.</div>"));
                                break;

                            case 8:
                                mail.To.Add(cliente.Email);
                                mail.Subject = "O pedido foi concluído com sucesso.";
                                stringHtml.Append(string.Concat("<div style='padding-top: 10px;'>O pedido de no. ", delicatessenOrderEmail.DelicatessenOrderId, " foi concluído com sucesso.</div>"));
                                break;

                            default:
                                Console.WriteLine("Default case");
                                break;
                        }

                        stringHtml.Append("<hr>");
                        stringHtml.Append("<div style='padding-top: 5px;'><h3>Detalhes do pedido</h3></div>");
                        stringHtml.Append("<div></div>");
                        stringHtml.Append(string.Concat("<div style='font-weight: bold;'>Cliente: ", cliente.Name, "</div>"));
                        stringHtml.Append(string.Concat("<div style='font-weight: bold;'>Telefone: ", cliente.PhoneNumber, "</div>"));
                        stringHtml.Append(string.Concat("<div style='font-weight: bold;'>CPF: ", cliente.Cpf, "</div>"));
                        stringHtml.Append("<div></div>");

                        if (delicatessenOrderEmail.DelicatessenOrder.InstorePickup.HasValue)
                        {
                            stringHtml.Append("<div style='padding-top: 5px;'><h3>Opção de entrega</h3></div>");
                            stringHtml.Append("<div></div>");
                            if (delicatessenOrderEmail.DelicatessenOrder.InstorePickup.Value == true)
                            {
                                stringHtml.Append("<div>Retirar na loja</div>");
                            }
                            else
                            {
                                stringHtml.Append("<div>Delivery</div>");
                            }
                        }

                        if (delicatessenOrderEmail.DelicatessenOrder.Address != null)
                        {
                            stringHtml.Append("<div style='padding-top: 15px;font-weight: bold;'>Endereço de entrega:</div>");
                            stringHtml.Append(string.Concat("<div>", delicatessenOrderEmail.DelicatessenOrder.Address.Street, ", CEP: ", delicatessenOrderEmail.DelicatessenOrder.Address.PostalCode, ", ", delicatessenOrderEmail.DelicatessenOrder.Address.City, "</div>"));
                            if (delicatessenOrderEmail.DelicatessenOrder.Address.Reference != String.Empty)
                            {
                                stringHtml.Append(string.Concat("<div>", delicatessenOrderEmail.DelicatessenOrder.Address.Reference, "</div>"));
                            }
                        }

                        stringHtml.Append("<div></div><div style='padding-top: 15px;font-weight: bold;'>Produtos enviados no pedido:</div> ");
                        stringHtml.Append("<div style='padding-top: 15px;'><table style='border: 1px solid #ddd;border-spacing: 0; border-collapse: collapse;background-color: transparent;width: 100%;max-width: 100%;margin-bottom: 20px;'><thead style='display: table-header-group; border-bottom: 2px solid #ddd;'>" +
                                "</thead><tbody>");

                        decimal totalCarrinho = 0;
                        delicatessenOrderEmail.DelicatessenOrder.DelicatessenOrderProducts.ToList().ForEach(pedidoproduto =>
                        {
                            stringHtml.Append("<tr><td>");
                            stringHtml.Append(string.Concat("<div>", pedidoproduto.DelicatessenProduct.Description, "</div>"));
                            stringHtml.Append(string.Concat("<div>Quantidade: ", pedidoproduto.Quantity.ToString("#"), "</div>"));
                            stringHtml.Append(string.Concat("<div>Valor do produto: ", pedidoproduto.Value.ToString("#,##0.00"), "</div>"));
                            stringHtml.Append("</td></tr>");
                            totalCarrinho += pedidoproduto.Quantity * pedidoproduto.Value;
                        });

                        decimal totalpedido = totalCarrinho;
                        stringHtml.Append("</tbody></table></div>");
                        stringHtml.Append(string.Concat("<div style='padding-top: 10px;font-weight: bold;'>Total do carrinho: ", totalCarrinho.ToString("#,##0.00"), "</div>"));
                        if (delicatessenOrderEmail.DelicatessenOrder.Coupon != null)
                        {
                            stringHtml.Append(string.Concat("<div style='padding-top: 10px;font-weight: bold;'>Cupom aplicado: ", delicatessenOrderEmail.DelicatessenOrder.Coupon.Code, " - ", delicatessenOrderEmail.DelicatessenOrder.Coupon.Description, "</div>"));
                            if (delicatessenOrderEmail.DelicatessenOrder.Coupon.Type)
                            {
                                totalpedido -= delicatessenOrderEmail.DelicatessenOrder.Coupon.Value;
                            }
                            else
                            {
                                totalpedido -= (totalpedido * delicatessenOrderEmail.DelicatessenOrder.Coupon.Value) / 100;
                            }
                        }

                        if (delicatessenOrderEmail.DelicatessenOrder.TaxValue.HasValue)
                        {
                            totalpedido = totalpedido + delicatessenOrderEmail.DelicatessenOrder.TaxValue.Value;
                            stringHtml.Append(string.Concat("<div style='padding-top: 10px;font-weight: bold;'>Taxa de entrega: ", delicatessenOrderEmail.DelicatessenOrder.TaxValue.Value.ToString("#,##0.00"), "</div>"));

                        }

                        stringHtml.Append(string.Concat("<div style='padding-top: 10px;font-weight: bold;'>Total do pedido: ", totalpedido.ToString("#,##0.00"), "</div>"));

                        stringHtml.Append("<div></div>");
                        stringHtml.Append("<div style='padding-top: 15px;font-weight: bold;'>Forma de Pagamento:</div>");
                        stringHtml.Append("<div></div>");
                        stringHtml.Append(string.Concat("<div>", delicatessenOrderEmail.DelicatessenOrder.PaymentCondition.Description, "</div>"));

                        if (delicatessenOrderEmail.DelicatessenOrder.PaymentConditionId.HasValue)
                        {
                            if (delicatessenOrderEmail.DelicatessenOrder.PaymentConditionId.Value == 1)
                            {
                                if (delicatessenOrderEmail.DelicatessenOrder.ExchangeForCash.HasValue)
                                {
                                    stringHtml.Append("<div></div>");
                                    stringHtml.Append("<div style='padding-top: 15px;font-weight: bold;'>Troco para:</div>");
                                    stringHtml.Append("<div></div>");
                                    stringHtml.Append(string.Concat("<div>", delicatessenOrderEmail.DelicatessenOrder.ExchangeForCash.Value.ToString("#,##0.00"), "</div>"));
                                }

                            }

                            if (delicatessenOrderEmail.DelicatessenOrder.PaymentConditionId.Value == 2)
                            {
                                    stringHtml.Append("<div></div>");
                                    stringHtml.Append("<div style='padding-top: 15px;font-weight: bold;'>Bandeira:</div>");
                                    stringHtml.Append("<div></div>");
                                    stringHtml.Append(string.Concat("<div>", delicatessenOrderEmail.DelicatessenOrder.EstablishmentBrandCredit.Brand.Name, "</div>"));
                            }

                            if (delicatessenOrderEmail.DelicatessenOrder.PaymentConditionId.Value == 3)
                            {
                                stringHtml.Append("<div></div>");
                                stringHtml.Append("<div style='padding-top: 15px;font-weight: bold;'>Bandeira:</div>");
                                stringHtml.Append("<div></div>");
                                stringHtml.Append(string.Concat("<div>", delicatessenOrderEmail.DelicatessenOrder.EstablishmentBrandDebit.Brand.Name, "</div>"));
                            }


                        }

                        mail.Body = stringHtml.ToString();
                        stringHtml.Clear();

                        mail.IsBodyHtml = true;
                        SmtpClient smtp = new SmtpClient(_configuration["STMPEmail"].ToString(), Convert.ToInt32(_configuration["PortEmail"].ToString()));
                        smtp.Credentials = new System.Net.NetworkCredential(_configuration["UserEmail"].ToString(), _configuration["PassEmail"].ToString());
                        smtp.Send(mail);
                        _DelicatessenOrderEmailRepository.Update(delicatessenOrderEmail);

                    });
                }
            }
            catch (SmtpFailedRecipientException ex)
            {

            }
            catch (SmtpException ex)
            {

            }
            catch (Exception ex)
            {

            }
            return Ok();
        }
    }
}
