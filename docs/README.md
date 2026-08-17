# Documentação do F-Zone VR

Este diretório é a fonte de verdade de produto, design e operação do jogo. Quando uma regra ou sistema mudar, a documentação correspondente deve ser atualizada no mesmo commit.

## Mapa da documentação

| Documento | Finalidade |
| --- | --- |
| [GDD](GDD.md) | Visão do jogo, pilares, modos, conteúdo, progressão e experiência pretendida. |
| [Design técnico](TECHNICAL-DESIGN.md) | Arquitetura, módulos, fluxo de estado, WebXR, áudio, persistência e desempenho. |
| [Regras de pista](TRACK-DESIGN.md) | Restrições obrigatórias para criar ou alterar circuitos. |
| [Experiência VR](VR-UX.md) | Interação com controles, menus, cockpit, HUD e conforto no Meta Quest. |
| [Plano de QA](QA.md) | Matriz de testes e regressões para desktop, gamepad, VR e GitHub Pages. |
| [Release e publicação](RELEASE.md) | Execução local, validação, GitHub Pages e checklist de entrega. |
| [Decisões](DECISIONS.md) | Registro curto das decisões que não devem ser perdidas ou revertidas por acidente. |
| [Roadmap](ROADMAP.md) | Prioridades, entregas concluídas e trabalho futuro. |

## Estado dos documentos

- **Implementado**: comportamento presente no código e verificável no jogo.
- **Parcial**: existe uma primeira versão, mas ainda não atende à visão completa.
- **Planejado**: decisão de produto aprovada, ainda sem implementação completa.
- **Ideia**: possibilidade em avaliação; não deve orientar código sem ser promovida no roadmap.

## Regra de manutenção

Toda alteração relevante deve responder, no mesmo pull request:

1. O GDD mudou?
2. Alguma regra de pista, VR ou balanceamento mudou?
3. O checklist de QA precisa de um novo caso?
4. Uma decisão duradoura merece registro?
5. O README e o roadmap ainda descrevem corretamente o projeto?

## Hierarquia em caso de conflito

1. O código representa o comportamento executável atual.
2. O GDD define a experiência desejada.
3. Os documentos especializados definem as restrições de implementação.
4. O roadmap define a ordem de trabalho, não substitui regras de design.
