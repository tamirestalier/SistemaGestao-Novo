import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function seedFuncionarios() {
  console.log("--- Seeding Funcionarios ---");

  const funcionarios = [
    { nome: "Carlos Almeida", email: "carlos.almeida@example.com", senha: "123456", contato: "(11) 91111-1111", funcao: "Cabeleireiro", endereco: "Rua Augusta, 500" },
    { nome: "Fernanda Costa", email: "fernanda.costa@example.com", senha: "123456", contato: "(11) 92222-2222", funcao: "Manicure", endereco: "Av. Paulista, 1000" },
    { nome: "Juliana Santos", email: "juliana.santos@example.com", senha: "123456", contato: "(11) 93333-3333", funcao: "Esteticista", endereco: "Rua Oscar Freire, 300" },
    { nome: "Rafael Oliveira", email: "rafael.oliveira@example.com", senha: "123456", contato: "(11) 94444-4444", funcao: "Barbeiro", endereco: "Rua da Consolação, 800" },
    { nome: "Patrícia Lima", email: "patricia.lima@example.com", senha: "123456", contato: "(11) 95555-5555", funcao: "Depiladora", endereco: "Av. Brigadeiro Faria Lima, 1500" },
    { nome: "Thiago Martins", email: "thiago.martins@example.com", senha: "123456", contato: "(11) 96666-6666", funcao: "Maquiador", endereco: "Rua Jardins, 200" },
    { nome: "Amanda Ribeiro", email: "amanda.ribeiro@example.com", senha: "123456", contato: "(11) 97777-7777", funcao: "Podóloga", endereco: "Av. Rebouças, 600" },
    { nome: "Bruno Cardoso", email: "bruno.cardoso@example.com", senha: "123456", contato: "(11) 98888-8888", funcao: "Cabeleireiro", endereco: "Rua Peixoto Gomide, 400" },
  ];

  for (const f of funcionarios) {
    const exists = await prisma.funcionarios.findUnique({ where: { email: f.email } });
    if (exists) {
      console.log(`  Já existe: ${f.nome} (${f.email})`);
      continue;
    }
    const hashedPassword = await bcrypt.hash(f.senha, 10);
    await prisma.funcionarios.create({
      data: {
        nome: f.nome,
        email: f.email,
        senha: hashedPassword,
        contato: f.contato,
        funcao: f.funcao,
        endereco: f.endereco,
      },
    });
    console.log(`  Criado: ${f.nome} (${f.email})`);
  }
}

async function seedClientes() {
  console.log("--- Seeding Clientes ---");

  const clientes = [
    { nome: "Maria Aparecida", contato: "(11) 98888-0001", endereco: "Rua das Flores, 123", preferencia_1: true },
    { nome: "João Batista", contato: "(11) 98888-0002", endereco: "Av. do Contorno, 456" },
    { nome: "Ana Clara Souza", contato: "(11) 98888-0003", endereco: "Rua da Praia, 789", preferencia_2: true },
    { nome: "Pedro Henrique", contato: "(11) 98888-0004", endereco: "Rua XV de Novembro, 101" },
    { nome: "Luísa Fernanda", contato: "(11) 98888-0005", endereco: "Av. Central, 202", preferencia_1: true, preferencia_2: true },
    { nome: "Gabriel Santos", contato: "(11) 98888-0006", endereco: "Rua das Acácias, 303" },
    { nome: "Isabela Cristina", contato: "(11) 98888-0007", endereco: "Rua dos Lírios, 404", preferencia_1: true },
    { nome: "Lucas Eduardo", contato: "(11) 98888-0008", endereco: "Av. Brasil, 505" },
    { nome: "Camila Rocha", contato: "(11) 98888-0009", endereco: "Rua do Comércio, 606" },
    { nome: "Felipe Augusto", contato: "(11) 98888-0010", endereco: "Rua São João, 707" },
    { nome: "Larissa Menezes", contato: "(11) 98888-0011", endereco: "Av. Independência, 808", preferencia_1: true },
    { nome: "Rodrigo Nogueira", contato: "(11) 98888-0012", endereco: "Rua da Liberdade, 909" },
    { nome: "Beatriz Oliveira", contato: "(11) 98888-0013", endereco: "Rua dos Pinheiros, 111" },
    { nome: "Daniel Pereira", contato: "(11) 98888-0014", endereco: "Av. dos Bandeirantes, 222" },
    { nome: "Marina Fagundes", contato: "(11) 98888-0015", endereco: "Rua da Harmonia, 333" },
  ];

  for (const c of clientes) {
    if (c.contato) {
      const existing = await prisma.clientes.findFirst({ where: { contato: c.contato } });
      if (existing) {
        console.log(`  Já existe: ${c.nome} (${c.contato})`);
        continue;
      }
    }
    await prisma.clientes.create({ data: c });
    console.log(`  Criado: ${c.nome} (${c.contato})`);
  }
}

async function seedProdutos() {
  console.log("--- Seeding Produtos ---");

  const produtos = [
    { descricao: "Shampoo Antiqueda", marca: "L'Oréal", qtd_estoque: 50, qtd_minima: 10, qtd_maxima: 100, vlr_venda: 45.90 },
    { descricao: "Condicionador Hidratante", marca: "Pantene", qtd_estoque: 80, qtd_minima: 15, qtd_maxima: 120, vlr_venda: 38.50 },
    { descricao: "Máscara Capilar de Reconstrução", marca: "Novex", qtd_estoque: 30, qtd_minima: 5, qtd_maxima: 60, vlr_venda: 29.90 },
    { descricao: "Óleo Capilar Reparador", marca: "Amend", qtd_estoque: 25, qtd_minima: 5, qtd_maxima: 50, vlr_venda: 54.90 },
    { descricao: "Esmalte Base Fortalecedora", marca: "Risqué", qtd_estoque: 120, qtd_minima: 20, qtd_maxima: 200, vlr_venda: 8.90 },
    { descricao: "Cera Modeladora", marca: "Salon Line", qtd_estoque: 40, qtd_minima: 10, qtd_maxima: 80, vlr_venda: 22.90 },
    { descricao: "Protetor Térmico", marca: "Schwarzkopf", qtd_estoque: 35, qtd_minima: 5, qtd_maxima: 70, vlr_venda: 63.90 },
    { descricao: "Kit Colorimetria Completo", marca: "Koleston", qtd_estoque: 15, qtd_minima: 3, qtd_maxima: 30, vlr_venda: 189.90 },
    { descricao: "Pente Profissional", marca: "Trisk", qtd_estoque: 60, qtd_minima: 10, qtd_maxima: 100, vlr_venda: 15.50 },
    { descricao: "Tesoura de Corte", marca: "Mondial", qtd_estoque: 10, qtd_minima: 2, qtd_maxima: 20, vlr_venda: 89.90 },
    { descricao: "Creme de Pentear", marca: "Neutrox", qtd_estoque: 45, qtd_minima: 10, qtd_maxima: 90, vlr_venda: 19.90 },
    { descricao: "Gel Fixador Extra Forte", marca: "Wella", qtd_estoque: 55, qtd_minima: 10, qtd_maxima: 110, vlr_venda: 35.90 },
    { descricao: "Spray Finalizador Brilho", marca: "L'Oréal", qtd_estoque: 20, qtd_minima: 5, qtd_maxima: 40, vlr_venda: 47.90 },
    { descricao: "Ampola Reconstrutora Capilar", marca: "Phytoervas", qtd_estoque: 100, qtd_minima: 20, qtd_maxima: 200, vlr_venda: 6.50 },
    { descricao: "Secador de Cabelo Profissional", marca: "Taiff", qtd_estoque: 8, qtd_minima: 2, qtd_maxima: 15, vlr_venda: 299.90 },
  ];

  for (const p of produtos) {
    const existing = await prisma.produtos.findFirst({
      where: { descricao: p.descricao, marca: p.marca },
    });
    if (existing) {
      console.log(`  Já existe: ${p.descricao} (${p.marca})`);
      continue;
    }
    await prisma.produtos.create({
      data: {
        ...p,
        data_inclusao: new Date(),
        STATUS: true,
      },
    });
    console.log(`  Criado: ${p.descricao} (${p.marca})`);
  }
}

async function seedServicos() {
  console.log("--- Seeding Servicos ---");

  const servicos = [
    { nome: "Corte Feminino", descricao: "Corte com lavagem e finalização", preco: 89.90, duracao: "01:00:00" },
    { nome: "Corte Masculino", descricao: "Corte com máquina e tesoura", preco: 49.90, duracao: "00:40:00" },
    { nome: "Hidratação Capilar", descricao: "Hidratação profunda com máscara profissional", preco: 69.90, duracao: "01:00:00" },
    { nome: "Escova Progressiva", descricao: "Alisamento progressivo com queratina", preco: 199.90, duracao: "02:30:00" },
    { nome: "Manicure Completa", descricao: "Corte, lixação e esmaltação das unhas das mãos", preco: 35.90, duracao: "00:45:00" },
    { nome: "Pedicure Completa", descricao: "Corte, lixação e esmaltação das unhas dos pés", preco: 45.90, duracao: "01:00:00" },
    { nome: "Design de Sobrancelhas", descricao: "Modelagem com pinça e correção", preco: 29.90, duracao: "00:30:00" },
    { nome: "Depilação com Cera", descricao: "Depilação de pernas completas com cera quente", preco: 59.90, duracao: "01:00:00" },
    { nome: "Maquiagem Social", descricao: "Maquiagem completa para eventos", preco: 129.90, duracao: "01:30:00" },
    { nome: "Coloração Capilar", descricao: "Coloração com tinta profissional", preco: 149.90, duracao: "02:00:00" },
    { nome: "Selante Capilar", descricao: "Selante térmico para brilho e maciez", preco: 79.90, duracao: "01:15:00" },
    { nome: "Barba Tradicional", descricao: "Aparar e modelar barba com navalha", preco: 39.90, duracao: "00:30:00" },
    { nome: "Podologia Básica", descricao: "Cuidados com unhas e calosidades dos pés", preco: 89.90, duracao: "01:00:00" },
    { nome: "Botox Capilar", descricao: "Tratamento reconstrutor com queratina líquida", preco: 119.90, duracao: "01:30:00" },
    { nome: "Luzes/Reflexos", descricao: "Técnica de descoloração com mechas", preco: 179.90, duracao: "03:00:00" },
  ];

  for (const s of servicos) {
    const existing = await prisma.servicos.findFirst({ where: { nome: s.nome } });
    if (existing) {
      console.log(`  Já existe: ${s.nome}`);
      continue;
    }
    await prisma.servicos.create({
      data: {
        nome: s.nome,
        descricao: s.descricao,
        preco: s.preco,
        duracao_estimada: s.duracao ? new Date(`1970-01-01T${s.duracao}`) : undefined,
      },
    });
    console.log(`  Criado: ${s.nome}`);
  }
}

async function seedKits() {
  console.log("--- Seeding Kits ---");

  const kits = [
    { nome: "Kit Bem-Estar", descricao: "Hidratação + Manicure + Design de Sobrancelhas", preco: 99.90, condicoes: "Válido por 30 dias" },
    { nome: "Kit Noivas", descricao: "Escova Progressiva + Maquiagem + Manicure + Pedicure", preco: 399.90, condicoes: "Inclui prova de maquiagem" },
    { nome: "Kit Dia do Homem", descricao: "Corte + Barba + Hidratação", preco: 99.90, condicoes: "Válido apenas para o dia do agendamento" },
    { nome: "Kit Reflexos + Corte", descricao: "Luzes/Reflexos + Corte Feminino + Hidratação", preco: 249.90, condicoes: "Agendamento mínimo de 3 horas" },
    { nome: "Kit Verão", descricao: "Depilação Completa + Pedicure + Escova Rápida", preco: 119.90, condicoes: "Promoção sazonal" },
    { nome: "Kit Mamãe e Bebê", descricao: "Corte maternal + Manicure + Corte infantil", preco: 129.90, condicoes: "Corte infantil incluso" },
    { nome: "Kit Spa dos Pés", descricao: "Pedicure + Podologia + Massagem relaxante", preco: 149.90, condicoes: "Inclui hidratação dos pés" },
    { nome: "Kit Cabelos Saudáveis", descricao: "Hidratação + Selante + Botox Capilar", preco: 199.90, condicoes: "Valor promocional por tempo limitado" },
  ];

  for (const k of kits) {
    const existing = await prisma.kits.findFirst({ where: { nome: k.nome } });
    if (existing) {
      console.log(`  Já existe: ${k.nome}`);
      continue;
    }
    await prisma.kits.create({
      data: {
        nome: k.nome,
        descricao: k.descricao,
        preco: k.preco,
        condicoes: k.condicoes,
      },
    });
    console.log(`  Criado: ${k.nome}`);
  }
}

async function seedAtendimentos() {
  console.log("--- Seeding Atendimentos ---");

  const atendimentos = [
    // --- ABRIL 2026 ---
    { funcionario_id: 11, cliente_id: 10, servico_id: 5,  horario: "2026-04-01T09:00:00Z", foco: false },
    { funcionario_id: 12, cliente_id: 11, servico_id: 3,  horario: "2026-04-01T10:00:00Z", foco: false },
    { funcionario_id: 13, cliente_id: 12, servico_id: 10, horario: "2026-04-03T14:00:00Z", foco: false },
    { funcionario_id: 14, cliente_id: 13, servico_id: 6,  horario: "2026-04-05T11:00:00Z", foco: false },
    { funcionario_id: 15, cliente_id: 14, servico_id: 11, horario: "2026-04-05T15:00:00Z", foco: false },
    { funcionario_id: 7,  cliente_id: 1,  servico_id: 7,  horario: "2026-04-08T09:30:00Z", foco: true },
    { funcionario_id: 8,  cliente_id: 5,  servico_id: 2,  horario: "2026-04-10T10:00:00Z", foco: false },
    { funcionario_id: 16, cliente_id: 15, servico_id: 12, horario: "2026-04-12T16:00:00Z", foco: false },
    { funcionario_id: 17, cliente_id: 16, servico_id: 16, horario: "2026-04-15T08:00:00Z", foco: false },
    { funcionario_id: 18, cliente_id: 17, servico_id: 5,  horario: "2026-04-18T13:00:00Z", foco: false },
    // --- MAIO 2026 ---
    { funcionario_id: 1,  cliente_id: 4,  servico_id: 6,  horario: "2026-05-02T09:00:00Z", foco: false },
    { funcionario_id: 3,  cliente_id: 6,  servico_id: 3,  horario: "2026-05-02T11:00:00Z", foco: false },
    { funcionario_id: 4,  cliente_id: 7,  servico_id: 7,  horario: "2026-05-04T14:00:00Z", foco: true },
    { funcionario_id: 11, cliente_id: 18, servico_id: 8,  horario: "2026-05-06T10:00:00Z", foco: false },
    { funcionario_id: 12, cliente_id: 19, servico_id: 3,  horario: "2026-05-09T15:30:00Z", foco: false },
    { funcionario_id: 13, cliente_id: 20, servico_id: 10, horario: "2026-05-11T09:00:00Z", foco: false },
    { funcionario_id: 14, cliente_id: 21, servico_id: 15, horario: "2026-05-13T16:00:00Z", foco: false },
    { funcionario_id: 7,  cliente_id: 8,  servico_id: 5,  horario: "2026-05-16T10:30:00Z", foco: false },
    { funcionario_id: 15, cliente_id: 22, servico_id: 11, horario: "2026-05-18T14:00:00Z", foco: false },
    { funcionario_id: 16, cliente_id: 23, servico_id: 12, horario: "2026-05-20T11:00:00Z", foco: false },
    { funcionario_id: 17, cliente_id: 24, servico_id: 16, horario: "2026-05-22T08:00:00Z", foco: false },
    { funcionario_id: 8,  cliente_id: 9,  servico_id: 13, horario: "2026-05-25T13:00:00Z", foco: true },
    // --- JUNHO 2026 ---
    { funcionario_id: 18, cliente_id: 10, servico_id: 5,  horario: "2026-06-01T09:00:00Z", foco: false },
    { funcionario_id: 11, cliente_id: 11, servico_id: 7,  horario: "2026-06-03T10:00:00Z", foco: true },
    { funcionario_id: 12, cliente_id: 12, servico_id: 3,  horario: "2026-06-05T14:30:00Z", foco: false },
    { funcionario_id: 13, cliente_id: 13, servico_id: 10, horario: "2026-06-06T09:30:00Z", foco: false },
    { funcionario_id: 1,  cliente_id: 14, servico_id: 6,  horario: "2026-06-08T11:00:00Z", foco: false },
    { funcionario_id: 14, cliente_id: 15, servico_id: 15, horario: "2026-06-10T16:00:00Z", foco: false },
    { funcionario_id: 3,  cliente_id: 16, servico_id: 9,  horario: "2026-06-12T08:00:00Z", foco: false },
    { funcionario_id: 15, cliente_id: 17, servico_id: 11, horario: "2026-06-15T15:00:00Z", foco: false },
    { funcionario_id: 7,  cliente_id: 1,  servico_id: 2,  horario: "2026-06-17T10:00:00Z", foco: false },
    { funcionario_id: 16, cliente_id: 18, servico_id: 12, horario: "2026-06-19T14:00:00Z", foco: false },
    { funcionario_id: 8,  cliente_id: 19, servico_id: 14, horario: "2026-06-22T11:00:00Z", foco: false },
    { funcionario_id: 17, cliente_id: 20, servico_id: 16, horario: "2026-06-24T09:00:00Z", foco: false },
    { funcionario_id: 4,  cliente_id: 21, servico_id: 7,  horario: "2026-06-26T13:30:00Z", foco: true },
    { funcionario_id: 18, cliente_id: 22, servico_id: 5,  horario: "2026-06-29T10:30:00Z", foco: false },
    // --- JULHO 2026 ---
    { funcionario_id: 11, cliente_id: 23, servico_id: 8,  horario: "2026-07-02T09:00:00Z", foco: false },
    { funcionario_id: 12, cliente_id: 24, servico_id: 3,  horario: "2026-07-04T10:00:00Z", foco: false },
    { funcionario_id: 13, cliente_id: 10, servico_id: 10, horario: "2026-07-07T14:00:00Z", foco: false },
    { funcionario_id: 14, cliente_id: 11, servico_id: 6,  horario: "2026-07-09T11:00:00Z", foco: false },
    { funcionario_id: 7,  cliente_id: 12, servico_id: 5,  horario: "2026-07-11T09:30:00Z", foco: false },
    { funcionario_id: 15, cliente_id: 13, servico_id: 11, horario: "2026-07-14T16:00:00Z", foco: false },
    { funcionario_id: 8,  cliente_id: 14, servico_id: 7,  horario: "2026-07-16T10:00:00Z", foco: true },
    { funcionario_id: 16, cliente_id: 15, servico_id: 12, horario: "2026-07-18T15:30:00Z", foco: false },
    { funcionario_id: 1,  cliente_id: 16, servico_id: 6,  horario: "2026-07-21T08:00:00Z", foco: false },
    { funcionario_id: 17, cliente_id: 17, servico_id: 16, horario: "2026-07-23T13:00:00Z", foco: false },
    { funcionario_id: 3,  cliente_id: 18, servico_id: 9,  horario: "2026-07-25T14:00:00Z", foco: false },
    { funcionario_id: 18, cliente_id: 19, servico_id: 5,  horario: "2026-07-28T11:00:00Z", foco: false },
    { funcionario_id: 4,  cliente_id: 20, servico_id: 7,  horario: "2026-07-30T09:00:00Z", foco: true },
    // --- AGOSTO 2026 ---
    { funcionario_id: 11, cliente_id: 21, servico_id: 14, horario: "2026-08-01T10:00:00Z", foco: false },
    { funcionario_id: 12, cliente_id: 22, servico_id: 3,  horario: "2026-08-03T15:00:00Z", foco: false },
    { funcionario_id: 7,  cliente_id: 23, servico_id: 2,  horario: "2026-08-05T09:00:00Z", foco: false },
    { funcionario_id: 13, cliente_id: 24, servico_id: 10, horario: "2026-08-07T14:30:00Z", foco: false },
    // --- SETEMBRO 2026 ---
    { funcionario_id: 14, cliente_id: 10, servico_id: 6,  horario: "2026-09-03T11:00:00Z", foco: false },
    { funcionario_id: 15, cliente_id: 11, servico_id: 11, horario: "2026-09-05T16:00:00Z", foco: false },
    { funcionario_id: 8,  cliente_id: 12, servico_id: 13, horario: "2026-09-09T10:00:00Z", foco: true },
    { funcionario_id: 16, cliente_id: 13, servico_id: 12, horario: "2026-09-12T09:30:00Z", foco: false },
    { funcionario_id: 17, cliente_id: 14, servico_id: 16, horario: "2026-09-15T14:00:00Z", foco: false },
    { funcionario_id: 1,  cliente_id: 15, servico_id: 6,  horario: "2026-09-18T08:00:00Z", foco: false },
  ];

  let criados = 0;
  let ignorados = 0;
  for (const a of atendimentos) {
    const horarioDate = new Date(a.horario);
    const conflito = await prisma.atendimentos.findFirst({
      where: {
        funcionario_id: a.funcionario_id,
        horario: horarioDate,
      },
    });
    if (conflito) {
      ignorados++;
      continue;
    }
    await prisma.atendimentos.create({
      data: {
        funcionario_id: a.funcionario_id,
        cliente_id: a.cliente_id,
        servico_id: a.servico_id,
        horario: horarioDate,
        foco: a.foco,
      },
    });
    criados++;
  }
  console.log(`  Criados ${criados} atendimentos (${ignorados} conflitos ignorados).`);
}

async function main() {
  console.log("Iniciando seed...\n");
  await seedFuncionarios();
  console.log();
  await seedClientes();
  console.log();
  await seedProdutos();
  console.log();
  await seedServicos();
  console.log();
  await seedKits();
  console.log();
  await seedAtendimentos();
  console.log("\nSeed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
