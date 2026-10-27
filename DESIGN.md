# Brasa Burger

## Overview

Loja de pedidos em português brasileiro. O cardápio é a entrada principal; marca e história apoiam a escolha, sem impedir o acesso aos produtos. A assinatura é uma fotografia gastronômica grande em uma apresentação compacta com tipografia forte. Fotografias são ilustrativas, valores e contato ainda não foram fornecidos.

## Colors

Carvão #191613 para texto e apresentação; creme #faf7f0 para superfícies; laranja #ed5b2a como destaque gráfico; ação escura #a93718 com texto claro. A implementação canônica dos tokens fica em src/style.css.

## Typography

DM Sans para títulos e interface, com alternativas sans-serif. Títulos fortes e curtos; corpo legível de 14–16 px no mínimo. Evitar caixa alta em frases longas e tracking menor que -0.04em.

## Layout

Mobile primeiro: navegação inferior com Cardápio, Sacola e A Brasa. Cards com foto e texto sem apertar descrições. Desktop: catálogo e resumo lateral. Sacola tem página própria, não um painel oculto. Limitar largura da composição a 1240px.

## Elevation & Depth

Profundidade discreta em diálogo e feedback. Evitar camadas decorativas e efeitos que atrasem a escolha.

## Shapes

Controles de pelo menos 44px. Cantos suaves em imagens e botões; categorias compactas com estado selecionado explícito.

## Components

Primitivas compartilhadas: ações primary/secondary, resumo do pedido, cards, busca, filtros, controles de quantidade e feedback status. Detalhes usam dialog nativo, com foco e Escape. Animações curtas; conteúdo visível por padrão; reduced-motion respeitado.

## Do's and Don'ts

Manter fotos identificadas como ilustrativas. Não inventar cidade, avaliações, preços, endereço ou horários. Não tratar abrir WhatsApp como pedido confirmado. Links comerciais ausentes não são simulados.
