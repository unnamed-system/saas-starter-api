INSERT INTO plans (id, name, benefits, active)
VALUES
  (1, 'Essencial', '[
    "Criar até 3 currículos",
    "Downloads ilimitados de currículos",
    "Acesso a 10 templates básicos",
    "Preenchimento rápido com nossos inputs",
    "Salvar currículos no histórico",
    "Compatível com PDF e Word"
  ]', true),

  (2, 'Pro', '[
    "Criar currículos 10",
    "Downloads ilimitados de currículos",
    "Acesso a 50 templates avançados",
    "IA para otimização de currículos",
    "Sugestão automática de melhorias",
    "Dicas de layout e design",
    "Salvar currículos no histórico",
    "Compatível com PDF e Word"
  ]', true),

  (3, 'Ultimate', '[
    "Todos os recursos do Pro",
    "Acesso a todos os templates existentes e futuros",
    "IA avançada com sugestões personalizadas",
    "Análise detalhada do currículo",
    "Suporte prioritário 24/7",
    "Sugestões de personalização de perfil LinkedIn",
    "Integração com plataformas de emprego"
  ]', true);


INSERT INTO plan_recurrences (id, plan_id, cycle, amount, duration_in_days, active)
VALUES
  -- Essencial
  (1, 1, 'WEEKLY', 9.90, 7, true),
  (2, 1, 'MONTHLY', 29.90, 30, true),
  (3, 1, 'YEARLY', 249.90, 365, true),

  -- Pro
  (4, 2, 'WEEKLY', 19.90, 7, true),
  (5, 2, 'MONTHLY', 69.90, 30, true),
  (6, 2, 'YEARLY', 587.90, 365, true),

  -- Ultimate
  (7, 3, 'WEEKLY', 39.90, 7, true),
  (8, 3, 'MONTHLY', 99.90, 30, true),
  (9, 3, 'YEARLY', 799.90, 365, true);



