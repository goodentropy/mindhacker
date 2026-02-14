'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CurriculumUpload from '@/components/CurriculumUpload';
// uploadCurriculum used by handleDemo for text-based demo
import { uploadCurriculum } from '@/lib/api';
import { createDemoSession } from '@/lib/demo';
import { Curriculum } from '@/lib/types';

/* ── Simulated session data for the dashboard ── */

const SIM_MESSAGES = [
  { role: 'user', text: 'Hi, teach me about the Civil War' },
  { role: 'assistant', text: 'Great! The Civil War (1861-1865) was fundamentally about two visions for America\'s future...' },
  { role: 'user', text: 'Tell me more about the battles' },
  { role: 'assistant', text: 'The Battle of Gettysburg in July 1863 was the turning point. Over three days...' },
  { role: 'user', text: 'I don\'t get this at all, its too confusing' },
  { role: 'assistant', text: 'Hey, I hear you. Let\'s step way back and simplify. Think of it like this...' },
  { role: 'user', text: 'Oh ok that makes more sense actually' },
  { role: 'assistant', text: 'Exactly! You\'ve got the core idea. Ready to build on that?' },
];

const SIM_TIMELINE = [
  { label: '1', engagement: 0.80, confidence: 0.70, frustration: 0.10, curiosity: 0.90, load: 0.20 },
  { label: '2', engagement: 0.85, confidence: 0.75, frustration: 0.10, curiosity: 0.85, load: 0.30 },
  { label: '3', engagement: 0.30, confidence: 0.20, frustration: 0.80, curiosity: 0.10, load: 0.90 },
  { label: '4', engagement: 0.50, confidence: 0.40, frustration: 0.40, curiosity: 0.30, load: 0.50 },
  { label: '5', engagement: 0.70, confidence: 0.65, frustration: 0.15, curiosity: 0.70, load: 0.25 },
];

const SIM_AGENT_LOG = [
  { tool: 'assess_emotional_state', summary: 'High curiosity, low frustration', color: '#8B5CF6' },
  { tool: 'adapt_content', summary: 'Deep content: battles & strategy', color: '#EEAB3D' },
  { tool: 'assess_emotional_state', summary: 'Frustration spike detected (0.8)', color: '#EF4444' },
  { tool: 'adapt_content', summary: 'Scaffolding: simplify + validate', color: '#EEAB3D' },
  { tool: 'assess_emotional_state', summary: 'Recovery: frustration dropping', color: '#22C55E' },
  { tool: 'adapt_content', summary: 'Gradual complexity increase', color: '#EEAB3D' },
];

const DIMENSIONS = [
  { key: 'engagement', label: 'Engagement', color: '#EEAB3D', value: 0.70 },
  { key: 'confidence', label: 'Confidence', color: '#22C55E', value: 0.65 },
  { key: 'frustration', label: 'Frustration', color: '#EF4444', value: 0.15 },
  { key: 'curiosity', label: 'Curiosity', color: '#8B5CF6', value: 0.70 },
  { key: 'cognitive_load', label: 'Cog. Load', color: '#F97316', value: 0.25 },
];

const CURRICULUM_NODES = [
  { title: 'Causes', done: true },
  { title: 'Battles', done: true },
  { title: 'Life During War', done: false, current: true },
  { title: 'Reconstruction', done: false },
  { title: 'Legacy', done: false },
];

export default function Home() {
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');

  const handleUploadComplete = (newSessionId: string, newCurriculum: Curriculum) => {
    setCurriculum(newCurriculum);
    setSessionId(newSessionId);
  };

  const handleStartLearning = () => {
    if (sessionId) router.push(`/session/${sessionId}`);
  };

  const handleDemo = async (autoStart = false) => {
    const demoContent = `
Unit: The American Civil War (Grade 8 History)

===

Chapter 1: Causes of the Civil War

By the mid-1800s, the United States was a nation divided. The Northern states had developed an economy based on manufacturing, trade, and small-scale farming. Cities like New York, Boston, and Philadelphia grew rapidly as immigrants arrived to work in factories. The Southern states, by contrast, built their economy on large-scale agriculture—especially cotton, tobacco, and sugar—that depended on the labor of enslaved African Americans.

Slavery was at the heart of the conflict. By 1860, nearly 4 million people were held in bondage across the South. Enslaved people had no legal rights: they could be bought, sold, and separated from their families at any time. Abolitionists in the North argued that slavery was morally wrong and called for its end. Southerners defended slavery as essential to their way of life and claimed that the federal government had no right to interfere with state laws.

Several key events pushed the nation closer to war. The Missouri Compromise of 1820 tried to maintain a balance between free and slave states by admitting Missouri as a slave state and Maine as a free state, and drawing a line across the western territories. The Compromise of 1850 admitted California as a free state but included the controversial Fugitive Slave Act, which required Northerners to return escaped enslaved people. The Kansas-Nebraska Act of 1854 allowed settlers in new territories to decide the slavery question for themselves, leading to violent clashes in "Bleeding Kansas."

The election of Abraham Lincoln in 1860 was the final breaking point. Although Lincoln said he would not abolish slavery where it already existed, Southern states saw his election as a threat. Between December 1860 and February 1861, seven Southern states seceded from the Union and formed the Confederate States of America. Four more states would join them after fighting began.

Learning Objectives:
- Identify the major causes of the Civil War
- Understand the role of slavery in creating national tension
- Analyze how compromise attempts ultimately failed
- Explain how the election of 1860 led to secession

===

Chapter 2: Key Battles and Turning Points

The Civil War began on April 12, 1861, when Confederate forces fired on Fort Sumter, a federal military post in Charleston Harbor, South Carolina. The attack lasted 34 hours before the Union garrison surrendered. This event shocked the nation and prompted both sides to call for volunteers. Many young men on both sides enlisted eagerly, believing the war would be short.

The first major land battle, the First Battle of Bull Run in July 1861, shattered that illusion. Union forces marched south from Washington, D.C., expecting an easy victory, but Confederate troops held their ground. General Thomas "Stonewall" Jackson earned his famous nickname by standing "like a stone wall" against the Union attack. The Union army retreated in chaos, and both sides realized this would be a long, brutal war.

The Battle of Antietam on September 17, 1862, remains the single bloodiest day in American history. Nearly 23,000 soldiers were killed, wounded, or missing in just twelve hours of fighting near Sharpsburg, Maryland. Although neither side won a clear victory, the battle stopped the Confederate invasion of the North and gave President Lincoln the opportunity to issue the Emancipation Proclamation, which declared enslaved people in Confederate states to be free.

The Battle of Gettysburg in July 1863 was the turning point of the war. Over three days in Pennsylvania, more than 165,000 soldiers clashed in the largest battle ever fought in North America. The Confederate army, led by General Robert E. Lee, launched a desperate assault known as Pickett's Charge on the third day. Union forces repelled the attack, and Lee was forced to retreat to Virginia. The Confederacy would never again have the strength to invade the North.

In 1864, Union General William T. Sherman led his army on a devastating "March to the Sea" from Atlanta to Savannah, Georgia. Sherman's forces destroyed railroads, factories, and farms across a 60-mile-wide path. The strategy, known as "total war," aimed to break the South's ability and will to fight. While militarily effective, the march caused tremendous suffering among civilians.

The war ended on April 9, 1865, when General Lee surrendered to Union General Ulysses S. Grant at Appomattox Court House in Virginia. The terms were generous: Confederate soldiers could go home and keep their horses for spring planting. Grant told his men, "The war is over. The Rebels are our countrymen again."

Learning Objectives:
- Understand the significance of major Civil War battles
- Analyze how specific battles changed the course of the war
- Evaluate the human cost of the conflict
- Explain the concept of total war and its impact

===

Chapter 3: Life During the War

The Civil War touched every aspect of American life. For the approximately 3 million soldiers who served, daily life was defined by long stretches of boredom punctuated by moments of terror. Soldiers spent most of their time in camp, drilling, cooking, writing letters home, and waiting. Disease killed twice as many soldiers as combat—conditions like dysentery, typhoid, and pneumonia spread quickly in crowded camps with poor sanitation.

On the home front, women took on new roles out of necessity. With men away at war, women managed farms, ran businesses, and worked in factories. Thousands served as nurses, a role previously considered unsuitable for women. Clara Barton, who would later found the American Red Cross, earned the nickname "Angel of the Battlefield" for her work caring for wounded soldiers. In the South, women managed plantations and dealt with increasing shortages of food, medicine, and basic goods as the Union naval blockade cut off trade.

For enslaved people, the war represented both danger and hope. As Union armies advanced into the South, thousands of enslaved people fled to Union lines, seeking freedom. The Union army initially did not know what to do with these refugees, but eventually began employing them as laborers, cooks, and guides. After the Emancipation Proclamation took effect on January 1, 1863, African American men were officially allowed to serve in the Union army. Nearly 180,000 Black soldiers served in the United States Colored Troops (USCT), fighting in major battles and earning respect through their courage and sacrifice. They faced additional dangers: if captured by Confederate forces, Black soldiers risked being enslaved or executed rather than treated as prisoners of war.

Children were also deeply affected by the war. Many lost fathers, brothers, or uncles. Some boys as young as 12 served as drummer boys or messengers. On the home front, children took over farm chores and family responsibilities. Schools closed or ran with fewer resources. The emotional toll of separation, loss, and uncertainty left lasting marks on an entire generation.

Learning Objectives:
- Describe the daily experiences of Civil War soldiers
- Analyze how the war changed roles for women in American society
- Understand the experiences of enslaved people during the war
- Explain the significance of African American military service

===

Chapter 4: Reconstruction

The period from 1865 to 1877, known as Reconstruction, was one of the most important and contested eras in American history. The nation faced enormous questions: How should the Southern states be brought back into the Union? What rights should formerly enslaved people have? Who should lead the process of rebuilding?

Three constitutional amendments transformed the legal landscape of the nation. The 13th Amendment, ratified in December 1865, permanently abolished slavery throughout the United States. The 14th Amendment, ratified in 1868, granted citizenship to all persons born in the United States—including formerly enslaved people—and promised them "equal protection of the laws." The 15th Amendment, ratified in 1870, prohibited denying the right to vote based on race.

The Freedmen's Bureau, established by Congress in 1865, was tasked with helping formerly enslaved people transition to freedom. The Bureau set up schools, hospitals, and courts. It helped negotiate labor contracts between formerly enslaved workers and landowners, and distributed food and clothing to those in need. For many formerly enslaved people, education was the most cherished opportunity: adults and children alike packed into makeshift schoolrooms, eager to learn to read and write for the first time.

Despite these gains, Reconstruction faced fierce opposition. White supremacist groups like the Ku Klux Klan used violence and intimidation to prevent Black citizens from voting, holding office, or exercising their new rights. Southern states passed "Black Codes" and later "Jim Crow" laws that restricted the freedoms of African Americans through segregation and discriminatory practices. Many formerly enslaved people were forced into sharecropping arrangements that kept them trapped in cycles of poverty and debt.

Reconstruction officially ended in 1877 when federal troops were withdrawn from the South as part of a political compromise. Without federal protection, many of the gains made during Reconstruction were rolled back. It would take nearly another century—until the Civil Rights Movement of the 1950s and 1960s—before the promises of the Reconstruction amendments would begin to be fully realized.

Learning Objectives:
- Explain the purpose and impact of the 13th, 14th, and 15th Amendments
- Describe the work of the Freedmen's Bureau
- Analyze the forces that opposed Reconstruction
- Evaluate why Reconstruction is considered both a success and a failure

===

Chapter 5: Legacy and Lasting Impact

The Civil War remains the deadliest conflict in American history. An estimated 620,000 to 750,000 soldiers died—more than in all other American wars combined up to that point. Entire communities were devastated. The war left physical scars on the Southern landscape and emotional scars on families across the nation.

The war's most important legacy was the end of slavery. The 13th Amendment permanently abolished an institution that had existed in North America for over 240 years. Four million people gained their freedom, and the nation was forced to confront fundamental questions about equality, citizenship, and human rights that it continues to grapple with today.

The Civil War also transformed the relationship between the federal government and the states. Before the war, many Americans thought of the United States as a collection of semi-independent states. The Union victory established that the nation was permanent and indivisible, and that the federal government had the authority to protect the rights of all citizens.

Debates about the Civil War's meaning continue to this day. Monuments to Confederate leaders, erected mostly during the Jim Crow era and the Civil Rights era as symbols of white supremacy, have become flashpoints for public debate. Some argue they represent heritage and history; others see them as celebrations of a cause built on slavery and racial oppression.

The struggle for racial equality that began with abolition and Reconstruction continues through the present day. The Civil Rights Movement of the 1950s and 1960s drew directly on the promises of the Reconstruction amendments. Leaders like Dr. Martin Luther King Jr. called on the nation to live up to the ideals expressed in the Declaration of Independence and the Constitution. Today, movements for racial justice continue this unfinished work, asking Americans to confront the ongoing effects of slavery, segregation, and systemic inequality.

Learning Objectives:
- Analyze the long-term consequences of the Civil War
- Understand how the war changed the nature of American government
- Evaluate ongoing debates about Civil War memory and monuments
- Connect the Civil War era to modern struggles for equality and justice
    `.trim();
    setIsLoading(true);
    setError('');
    try {
      const res = createDemoSession(demoContent, 'The American Civil War (Grade 8 History)');
      setCurriculum(res.curriculum);
      setSessionId(res.session_id);
      if (autoStart && res.session_id) {
        router.push(`/session/${res.session_id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse curriculum');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh relative overflow-hidden">
      <div className="orb orb-amber animate-float-slow" style={{ top: '-5%', left: '5%', width: '600px', height: '600px' }} />
      <div className="orb orb-ice animate-float-medium" style={{ top: '15%', right: '-8%', width: '500px', height: '500px' }} />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber to-amber-dark flex items-center justify-center glow-amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a8 8 0 0 0-8 8c0 3.4 2.1 6.4 4 8l1.2 1.2a2 2 0 0 0 2.8 0h0a2 2 0 0 0 0-2.8" />
                <path d="M12 2a8 8 0 0 1 8 8c0 3.4-2.1 6.4-4 8l-1.2 1.2a2 2 0 0 1-2.8 0" />
                <circle cx="12" cy="10" r="2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">MindHacker</h1>
              <p className="text-[11px] text-ice-dark font-medium tracking-wide">Emotionally Intelligent Learning</p>
            </div>
          </div>
          <button
            onClick={() => handleDemo(true)}
            disabled={isLoading}
            className="btn-primary shimmer px-6 py-2.5 rounded-xl text-sm font-heading inline-flex items-center gap-2"
          >
            {isLoading ? 'Launching demo...' : 'Try the Demo'}
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            )}
          </button>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6">
        {/* ── Hero ── */}
        <section className="pt-12 pb-8 text-center">
          <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-xs font-semibold tracking-wide uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-status-blink" />
            <span className="gradient-text-static">5 AI Agents &middot; Real-time Adaptation &middot; Trauma Informed</span>
          </div>
          <h2 className="animate-slide-up text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4 tracking-tight leading-[1.1]" style={{ animationDelay: '60ms' }}>
            Learning analytics that{' '}
            <span className="gradient-text">adapt in real-time</span>
          </h2>
          <p className="animate-slide-up text-base text-foreground/45 max-w-2xl mx-auto leading-relaxed mb-2" style={{ animationDelay: '120ms' }}>
            MindHacker monitors five emotional dimensions every message, deriving flow state, dropout risk, and challenge readiness to reshape content before the student sees it.
          </p>
        </section>

        {/* ══════════════════════════════════════════════
            ANALYTICS DASHBOARD — The Centerpiece
           ══════════════════════════════════════════════ */}
        <section className="animate-slide-up pb-6" style={{ animationDelay: '200ms' }}>
          <div className="glass-strong rounded-3xl overflow-hidden shadow-xl border border-white/30">

            {/* Dashboard header bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-ice/20 bg-gradient-to-r from-ice-light/20 to-transparent">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-[11px] font-heading font-bold text-foreground/50 uppercase tracking-wider">Live Session</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-foreground/30 font-mono">
                <span>session: demo-8f3a</span>
                <span>student: Alex M.</span>
                <span>module 3 of 5</span>
              </div>
            </div>

            {/* Curriculum progress strip */}
            <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-ice/15 bg-white/20">
              {CURRICULUM_NODES.map((node, i) => (
                <div key={node.title} className="flex items-center shrink-0">
                  <div className={`w-6 h-6 rounded-full text-[8px] font-heading font-bold flex items-center justify-center ${
                    node.done
                      ? 'bg-gradient-to-br from-amber to-amber-dark text-white'
                      : node.current
                      ? 'bg-amber/10 text-amber border-[1.5px] border-amber'
                      : 'bg-ice/30 text-ice-dark'
                  }`}>
                    {node.done ? (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : i + 1}
                  </div>
                  <span className={`text-[9px] ml-1.5 mr-3 font-medium ${node.current ? 'text-amber font-bold' : 'text-foreground/30'}`}>{node.title}</span>
                  {i < CURRICULUM_NODES.length - 1 && <div className={`w-6 h-[1.5px] rounded-full mr-1.5 ${node.done ? 'bg-amber/40' : 'bg-ice/30'}`} />}
                </div>
              ))}
            </div>

            {/* Main 3-column dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] min-h-[520px]">

              {/* Left: Chat simulation */}
              <div className="flex flex-col border-r border-ice/15">
                <div className="flex-1 px-5 py-4 space-y-3 overflow-y-auto">
                  {SIM_MESSAGES.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`} style={{ animationDelay: `${300 + i * 80}ms` }}>
                      <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-amber to-amber-dark text-white rounded-br-md'
                          : 'bg-white/60 backdrop-blur-sm border border-ice/20 rounded-bl-md text-foreground/70'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Fake input */}
                <div className="px-4 py-3 border-t border-ice/15 bg-white/30">
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/50 border border-ice/30">
                    <span className="text-xs text-foreground/25 flex-1">Type your message...</span>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber/20 to-amber/10 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EEAB3D" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Analytics sidebar */}
              <div className="bg-gradient-to-b from-ice-light/10 to-transparent p-4 space-y-4 overflow-y-auto">

                {/* Student status */}
                <div className="animate-scale-in p-3 rounded-xl bg-gradient-to-br from-green-500/8 to-green-600/3 border border-green-400/15" style={{ animationDelay: '400ms' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-glow-pulse" />
                      <span className="text-[10px] font-heading font-bold text-green-600 uppercase tracking-wider">Engaged &amp; Learning</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/50 text-foreground/40 font-semibold">Neutral</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-foreground/30 font-medium w-6">Flow</span>
                    <div className="flex-1 h-1.5 bg-white/40 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: '72%', boxShadow: '0 0 8px rgba(34,197,94,0.3)' }} />
                    </div>
                    <span className="text-[10px] font-heading font-bold text-foreground/40 w-5 text-right">72</span>
                  </div>
                </div>

                {/* 5 Emotional dimensions */}
                <div className="animate-scale-in" style={{ animationDelay: '450ms' }}>
                  <h4 className="text-[9px] font-heading font-bold text-foreground/30 uppercase tracking-[0.2em] mb-2">Emotional State</h4>
                  <div className="space-y-1.5">
                    {DIMENSIONS.map((dim) => (
                      <div key={dim.key} className="flex items-center gap-2">
                        <span className="text-[9px] text-foreground/35 font-medium w-14 truncate">{dim.label}</span>
                        <div className="flex-1 h-1.5 bg-ice/30 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${dim.value * 100}%`, backgroundColor: dim.color, boxShadow: `0 0 6px ${dim.color}40` }} />
                        </div>
                        <span className="text-[9px] font-mono text-foreground/25 w-6 text-right">{(dim.value * 100).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk metrics */}
                <div className="animate-scale-in grid grid-cols-2 gap-2" style={{ animationDelay: '500ms' }}>
                  <div className="p-2.5 rounded-xl bg-white/40 text-center">
                    <span className="text-[9px] text-foreground/30 font-semibold block mb-0.5">Dropout Risk</span>
                    <span className="text-lg font-heading font-bold text-green-500">8%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/40 text-center">
                    <span className="text-[9px] text-foreground/30 font-semibold block mb-0.5">Challenge Ready</span>
                    <span className="text-lg font-heading font-bold gradient-text-static">72%</span>
                  </div>
                </div>

                {/* Emotion timeline mini-chart */}
                <div className="animate-scale-in" style={{ animationDelay: '550ms' }}>
                  <h4 className="text-[9px] font-heading font-bold text-foreground/30 uppercase tracking-[0.2em] mb-2">Session Timeline</h4>
                  <div className="bg-white/30 rounded-xl p-3">
                    {/* Mini sparkline-style chart */}
                    <svg viewBox="0 0 240 60" className="w-full h-14">
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="240" y2="30" stroke="rgba(211,229,235,0.3)" strokeWidth="0.5" />
                      {/* Engagement line */}
                      <polyline
                        points={SIM_TIMELINE.map((p, i) => `${i * 60},${60 - p.engagement * 55}`).join(' ')}
                        fill="none" stroke="#EEAB3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      />
                      {/* Frustration line */}
                      <polyline
                        points={SIM_TIMELINE.map((p, i) => `${i * 60},${60 - p.frustration * 55}`).join(' ')}
                        fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 2"
                      />
                      {/* Frustration spike marker */}
                      <circle cx="120" cy={60 - 0.80 * 55} r="3" fill="#EF4444" opacity="0.8">
                        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                    <div className="flex items-center justify-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-[1.5px] rounded-full bg-amber" /><span className="text-[8px] text-foreground/25">Engagement</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-[1.5px] rounded-full bg-red-400" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #EF4444 0 3px, transparent 3px 5px)' }} /><span className="text-[8px] text-foreground/25">Frustration</span></div>
                    </div>
                  </div>
                </div>

                {/* Agent feed */}
                <div className="animate-scale-in" style={{ animationDelay: '600ms' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[9px] font-heading font-bold text-foreground/30 uppercase tracking-[0.2em]">Agent Feed</h4>
                    <div className="flex items-center gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber" />
                      </span>
                      <span className="text-[8px] text-foreground/25 font-medium">LIVE</span>
                    </div>
                  </div>
                  <div className="space-y-1 font-mono">
                    {SIM_AGENT_LOG.map((entry, i) => (
                      <div key={i} className="flex items-start gap-2 text-[10px] py-1 px-2 rounded-lg hover:bg-white/20 transition-colors animate-fade-in-up" style={{ animationDelay: `${650 + i * 60}ms` }}>
                        <div className="w-1 h-1 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: entry.color, boxShadow: `0 0 5px ${entry.color}50` }} />
                        <span className="text-foreground/35 truncate">{entry.summary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works strip ── */}
        <section className="py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '📡', title: 'Collect', desc: 'Every message analyzed for emotional signals across 5 dimensions' },
              { icon: '🧠', title: 'Model', desc: 'Real-time emotional profile with flow, risk, and readiness scores' },
              { icon: '⚡', title: 'Adapt', desc: 'Content reshaped instantly — complexity, framing, pacing, tone' },
              { icon: '📈', title: 'Measure', desc: 'Outcomes feed back into the model, continuously improving' },
            ].map((step, i) => (
              <div key={step.title} className="animate-slide-up glass rounded-2xl p-5 text-center card-hover" style={{ animationDelay: `${300 + i * 80}ms` }}>
                <span className="text-2xl block mb-2">{step.icon}</span>
                <h4 className="font-heading font-bold text-sm text-foreground mb-1">{step.title}</h4>
                <p className="text-[11px] text-foreground/40 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA / Upload section ── */}
        <section className="pb-20">
          {!showUpload && !curriculum && (
            <div className="text-center animate-slide-up" style={{ animationDelay: '500ms' }}>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-3">See it with your own curriculum</h3>
              <p className="text-sm text-foreground/40 mb-6 max-w-md mx-auto">Upload any lesson plan and watch 5 AI agents transform it into an emotionally adaptive learning experience.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => handleDemo(true)}
                  disabled={isLoading}
                  className="btn-primary shimmer px-8 py-3.5 rounded-2xl text-sm font-heading inline-flex items-center gap-2"
                >
                  {isLoading ? 'Launching demo...' : 'Try the Demo'}
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  )}
                </button>
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-8 py-3.5 rounded-2xl text-sm font-heading font-semibold glass text-foreground/60 hover:text-foreground transition-all hover:shadow-md"
                >
                  Upload your own
                </button>
              </div>
            </div>
          )}

          {showUpload && !curriculum && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-1">Upload your curriculum</h3>
                <p className="text-sm text-foreground/40">Paste a lesson plan, unit outline, or worksheet.</p>
              </div>
              <CurriculumUpload onUploadComplete={handleUploadComplete} isLoading={isLoading} setIsLoading={setIsLoading} setError={setError} />
              <div className="text-center mt-4">
                <button
                  onClick={() => handleDemo(false)}
                  disabled={isLoading}
                  className="text-sm text-amber hover:text-amber-dark font-medium underline underline-offset-4 decoration-amber/30 hover:decoration-amber/60 transition-all disabled:opacity-40"
                >
                  {isLoading ? 'Parsing...' : 'Or try with a demo curriculum (Grade 8 Civil War)'}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 glass border border-red-200/50 rounded-2xl text-sm text-red-600 text-center">
                  {error}
                </div>
              )}
            </div>
          )}

          {curriculum && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="animate-scale-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-amber/20 text-sm font-medium mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EEAB3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 15l2 2 4-4" /></svg>
                  <span className="gradient-text-static">Curriculum parsed</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-1">{curriculum.subject || 'Your Curriculum'}</h2>
                <p className="text-sm text-foreground/40">{curriculum.nodes.length} modules ready</p>
              </div>
              <div className="space-y-2 mb-6">
                {curriculum.nodes.map((node, i) => (
                  <div key={node.id} className="animate-slide-up flex items-start gap-3 p-3.5 glass rounded-xl" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber/15 to-amber/5 text-amber font-heading font-bold text-[10px] flex items-center justify-center shrink-0">{i + 1}</div>
                    <div>
                      <h4 className="font-heading font-semibold text-foreground text-sm">{node.title}</h4>
                      <p className="text-[11px] text-foreground/40 mt-0.5">{node.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleStartLearning}
                className="w-full py-3.5 btn-primary shimmer rounded-2xl flex items-center justify-center gap-2 text-base font-heading"
              >
                Launch Session
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
