"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Laptop,
  CheckCircle2,
  ArrowUpRight,
  ArrowDown,
  Sparkles,
  MapPin,
  Flame,
  Globe,
  ShieldCheck,
  Zap,
  Layers,
} from "lucide-react";
import OrderDemo from "@/components/developer/OrderDemo";
import LanguageDemo from "@/components/developer/LanguageDemo";
import SplashLayerDemo from "@/components/developer/SplashLayerDemo";
import type { CaseStudyContent } from "@/data/developerCaseStudy";
import "@/app/[locale]/tasarim-gelistirme/case-study.css";

interface DeveloperProfileProps {
  content: CaseStudyContent;
  isRTL: boolean;
  lang: string;
}

export default function DeveloperProfile({
  content,
  isRTL,
  lang,
}: DeveloperProfileProps) {
  const {
    hero,
    facts,
    story,
    experience,
    languages,
    splashCraft,
    engineering,
    closing,
  } = content;

  const menuUrl = `/${lang}/menu`;
  const aboutUrl = `/${lang}/about`;

  return (
    <article className="dev-case-study" dir={isRTL ? "rtl" : "ltr"}>
      {/* 1. HERO SECTION */}
      <section className="hero" id="top" aria-label="Cihangir Digital Case Study Hero">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">
              <Laptop size={14} className="eyebrow-icon text-[#E68B30]" />
              <span>{hero.eyebrowTag}</span>
              <span className="eyebrow-divider">/</span>
              <span>{hero.eyebrowCity}</span>
            </p>

            <h1>
              {hero.titleLine1}
              <br />
              {hero.titleLine2}
              <em>{hero.titleEm}</em>
              <br />
              {hero.titleLine3}
            </h1>

            <p className="hero-description">{hero.description}</p>

            <div className="hero-actions">
              <a className="button button--accent" href="#story">
                <span>{hero.ctaExplore}</span>
                <ArrowDown size={14} />
              </a>
              <Link className="button button--quiet" href={menuUrl}>
                <span>{hero.ctaMenu}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="hero-credit">
              <span className="credit-avatar">{hero.devAvatar}</span>
              <span>
                <b>{hero.devName}</b>
                <small>{hero.devRole}</small>
              </span>
              <span className="credit-line" aria-hidden="true" />
              <span className="hero-issue">{hero.devIssue}</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Cihangir pide and Dish Showcase">
            <div className="hero-image-frame">
              <Image
                src="/images/hero-ltr.jpg"
                alt="Cihangir Ev Yemekleri & Pide"
                className="hero-food-image"
                width={540}
                height={520}
                priority
              />
              <div className="image-vignette" aria-hidden="true" />
              <span className="image-caption">
                TRADITIONAL HEARTH & POTS <span>BEYOĞLU · İSTANBUL</span>
              </span>
            </div>

            <div className="hero-roundel" aria-label="Cihangir Daily Hearth Pots">
              <span className="roundel-top">{hero.roundelTop}</span>
              <strong>
                {hero.roundelHour}
                <small>:</small>
                {hero.roundelMinute}
              </strong>
              <span className="roundel-bottom">{hero.roundelBottom}</span>
            </div>

            <div className="hero-note">
              <Image
                src="/splash/logo-original.webp"
                alt="Cihangir Logo"
                width={42}
                height={42}
                className="object-contain"
              />
              <div>
                <b>{hero.noteTitle}</b>
                <br />
                {hero.noteSubtitle}
              </div>
            </div>

            <div className="hero-side-label">{hero.sideLabel}</div>
          </div>
        </div>

        <div className="hero-bottomline">
          <span>{hero.bottomline}</span>
          <a href="#facts">
            <span>{hero.scrollDown}</span>
            <ArrowDown size={13} />
          </a>
        </div>
      </section>

      {/* 2. FACTS STRIP */}
      <section className="facts-strip" id="facts" aria-label="Project Scope and Metrics">
        <div className="fact-intro">
          <span className="section-tag">{facts.tag}</span>
          <b>{facts.title}</b>
        </div>
        <div className="fact">
          <strong>{facts.languages}</strong>
          <span>{facts.languagesLabel}</span>
        </div>
        <div className="fact">
          <strong>{facts.currencies}</strong>
          <span>{facts.currenciesLabel}</span>
        </div>
        <div className="fact">
          <strong>{facts.pagesCount}</strong>
          <span>{facts.pagesLabel}</span>
        </div>
        <div className="fact">
          <strong>{facts.foucScore}</strong>
          <span>{facts.foucLabel}</span>
        </div>
        <div className="fact-stamp" aria-hidden="true">
          {facts.stampDistrict}
          <br />
          <b>{facts.stampCity}</b>
        </div>
      </section>

      {/* 3. STORY SECTION */}
      <section className="story-section section-pad" id="story">
        <div className="section-index">
          <span>{story.index}</span>
          <i /> {story.sectionName}
        </div>

        <div className="story-layout">
          <div className="story-headline">
            <p className="section-tag">{story.tag}</p>
            <h2>
              {story.h2Part1}
              <br />
              <em>{story.h2Em}</em> {story.h2Part2}
            </h2>
          </div>

          <div className="story-copy">
            <p className="lead-copy">{story.lead}</p>
            <p>{story.p}</p>
            <Link className="text-link" href={aboutUrl}>
              <span>{story.linkText}</span>
              <ArrowUpRight size={14} className="inline-block ml-1" />
            </Link>
          </div>
        </div>

        {/* Photo Band */}
        <div className="story-photo-band">
          <Image
            src="/sofra/asci-tabagi.jpg"
            alt="Cihangir Ev Yemekleri Geleneksel Aşçı Tabağı"
            fill
            className="story-band-bg-img object-cover"
          />
          <div className="photo-band-overlay" />
          <div className="photo-band-label">
            <span>{story.photoBadge}</span>
            <b>{story.photoHeadline}</b>
          </div>
          <div className="photo-band-number">
            {story.photoLocation}
            <br />
            <strong>{story.photoCoord}</strong>
          </div>
        </div>

        {/* 3 Principles Cards */}
        <div className="principles-row">
          {story.principles.map((pr, idx) => {
            const principleImages = [
              "/images/products/tas-kebabi-350.jpg",
              "/sofra/karisik-pide.jpg",
              "/images/products/elbasan.jpg",
            ];
            return (
              <div key={idx} className="principle-card">
                <div className="principle-card__media">
                  <Image
                    src={principleImages[idx]}
                    alt={pr.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="principle-card__img object-cover"
                  />
                </div>
                <div className="principle-card__text">
                  <span className="principle-num">{pr.num}</span>
                  <h3>{pr.title}</h3>
                  <p>{pr.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. INTERACTIVE EXPERIENCE (PHONE DEMO) */}
      <section className="experience-section section-pad" id="experience">
        <div className="section-index">
          <span>{experience.index}</span>
          <i /> {experience.sectionName}
        </div>

        <div className="experience-header">
          <div>
            <p className="section-tag">{experience.tag}</p>
            <h2>
              {experience.h2Part1}
              <br />
              <em>{experience.h2Em}</em>
            </h2>
          </div>
          <p className="experience-intro-text">{experience.intro}</p>
        </div>

        <div className="experience-grid">
          <div className="phone-stage">
            <div className="phone-orbit phone-orbit--one" aria-hidden="true" />
            <div className="phone-orbit phone-orbit--two" aria-hidden="true" />
            <OrderDemo lang={lang} />
            <span className="phone-stage-caption">{experience.stageCaption}</span>
          </div>

          <div className="experience-side">
            {experience.notes.map((note, idx) => (
              <div className="experience-note" key={idx}>
                <span className="note-symbol">{note.symbol}</span>
                <div>
                  <b>{note.title}</b>
                  <p>{note.desc}</p>
                </div>
              </div>
            ))}

            <Link className="live-menu-card" href={menuUrl}>
              <div>
                <span>{experience.liveMenuTag}</span>
                <b>{experience.liveMenuTitle}</b>
              </div>
              <span className="live-menu-arrow" aria-hidden="true">
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. MULTILINGUAL SECTION (10 LANGUAGES DEMO) */}
      <section className="language-section section-pad" id="languages">
        <div className="section-index section-index--light">
          <span>{languages.index}</span>
          <i /> {languages.sectionName}
        </div>

        <div className="language-layout">
          <div className="language-copy">
            <p className="section-tag section-tag--light">{languages.tag}</p>
            <h2>
              {languages.h2Part1}
              <br />
              <em>{languages.h2Em}</em>
              <br />
              {languages.h2Part2}
            </h2>
            <p>{languages.intro}</p>
            <div className="language-specs">
              {languages.specs.map((sp, idx) => (
                <span key={idx}>
                  <b>{sp.b}</b>
                  {sp.label}
                </span>
              ))}
            </div>
          </div>

          <LanguageDemo initialLang={lang} />
        </div>

        <div className="language-bottomnote">
          <span>{languages.bottom1}</span>
          <span>
            <b>{languages.bottom2}</b>
          </span>
        </div>
      </section>

      {/* 6. SMART SPLASH LAYER CRAFT */}
      <section className="splash-craft-section section-pad" id="splash-craft">
        <div className="section-index">
          <span>{splashCraft.index}</span>
          <i /> {splashCraft.sectionName}
        </div>

        <div className="splash-craft-header">
          <div>
            <p className="section-tag">{splashCraft.tag}</p>
            <h2>
              {splashCraft.h2Part1}
              <br />
              <em>{splashCraft.h2Em}</em>
            </h2>
          </div>
          <p>{splashCraft.intro}</p>
        </div>

        <SplashLayerDemo lang={lang} />
      </section>

      {/* 7. ENGINEERING SECTION */}
      <section className="engineering-section section-pad" id="engineering">
        <div className="section-index">
          <span>{engineering.index}</span>
          <i /> {engineering.sectionName}
        </div>

        <div className="engineering-heading">
          <div>
            <p className="section-tag">{engineering.tag}</p>
            <h2>
              {engineering.h2Part1}
              <br />
              <em>{engineering.h2Em}</em>
            </h2>
          </div>
          <p>{engineering.intro}</p>
        </div>

        <div className="architecture-list">
          {engineering.items.map((item) => (
            <article className="architecture-item" key={item.number}>
              <span className="architecture-number">{item.number}</span>
              <div className="architecture-title">
                <span>{item.cat}</span>
                <h3>{item.title}</h3>
              </div>
              <p>{item.desc}</p>
              <span className="architecture-glyph" aria-hidden="true">
                {item.glyph}
              </span>
            </article>
          ))}
        </div>

        <div className="stack-rail">
          <span>{engineering.stackLabel}</span>
          <div>
            {engineering.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="seo-note">
          <span className="seo-note__mark">{engineering.seoNoteMark}</span>
          <div>
            <b>{engineering.seoNoteTitle}</b>
            <p>{engineering.seoNoteDesc}</p>
          </div>
          <span className="seo-note__status">
            <CheckCircle2 size={16} className="text-emerald-500 inline-block mr-1" />
            {engineering.seoNoteStatus}
          </span>
        </div>
      </section>

      {/* 8. CLOSING SECTION */}
      <section className="closing-section">
        <Image
          src="/images/hero-ltr.jpg"
          alt="Cihangir Ev Yemekleri & Pide"
          fill
          className="closing-photo object-cover"
        />
        <div className="closing-scrim" />
        <div className="closing-content">
          <span className="closing-overline">{closing.overline}</span>
          <h2>
            {closing.h2Part1}
            <br />
            <em>{closing.h2Em}</em>
            <br />
            {closing.h2Part2}
          </h2>
          <p>{closing.desc}</p>
          <div className="closing-actions">
            <a
              className="button button--accent"
              href={closing.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{closing.ctaTalk}</span>
              <ArrowUpRight size={15} />
            </a>
            <a
              className="button button--outline"
              href={closing.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{closing.ctaPortfolio}</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div className="closing-credit">
          {closing.creditLabel} <b>{closing.creditName}</b>
        </div>
      </section>
    </article>
  );
}

