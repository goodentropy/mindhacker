export interface SampleCurriculum {
  id: string;
  title: string;
  subject: string;
  emoji: string;
  description: string;
  content: string;
}

export const SAMPLES: SampleCurriculum[] = [
  {
    id: 'psych-101',
    title: 'Intro to Psychology',
    subject: 'Introduction to Psychology',
    emoji: '\u{1F9E0}',
    description: 'Classical conditioning, cognitive biases, memory, social influence, and mental health.',
    content: `Chapter 1: Classical & Operant Conditioning

Behavioral psychology studies how organisms learn through interaction with their environment. Ivan Pavlov discovered classical conditioning when he noticed dogs salivating at the sound of a bell that had been paired with food. This process pairs a neutral stimulus with an unconditioned stimulus until the neutral stimulus alone triggers the response. B.F. Skinner expanded on this with operant conditioning, showing that behavior is shaped by its consequences — reinforcement increases behavior while punishment decreases it. These principles underpin modern therapies like systematic desensitization for phobias.

Learning Objectives:
- Define classical and operant conditioning
- Distinguish between positive/negative reinforcement and punishment
- Identify real-world applications of conditioning principles

===

Chapter 2: Cognitive Biases & Heuristics

Human thinking relies on mental shortcuts called heuristics that usually work well but can produce systematic errors. The availability heuristic leads us to judge probability based on how easily examples come to mind — plane crashes feel more dangerous than car rides because they are more memorable. Confirmation bias drives us to seek information that supports what we already believe while ignoring contradictory evidence. Anchoring causes us to rely too heavily on the first piece of information we encounter. Understanding these biases is essential for critical thinking.

Learning Objectives:
- Explain what heuristics are and why the brain uses them
- Identify at least four common cognitive biases
- Analyze how biases affect decision-making in everyday life

===

Chapter 3: Memory Systems

Memory is not a single system but a collection of processes. Sensory memory holds information for fractions of a second, short-term (working) memory maintains about 7 items for roughly 30 seconds, and long-term memory stores information indefinitely. Encoding transforms sensory input into storable form through elaborative rehearsal and meaningful association. Retrieval can fail due to interference, decay, or lack of appropriate cues. The hippocampus plays a central role in forming new declarative memories, as demonstrated by the famous case of patient H.M.

Learning Objectives:
- Describe the three-stage model of memory
- Explain encoding, storage, and retrieval processes
- Discuss factors that improve or impair memory formation

===

Chapter 4: Social Influence & Conformity

Humans are profoundly shaped by social context. Solomon Asch's conformity experiments showed that people will agree with an obviously wrong answer just to match the group. Stanley Milgram's obedience studies demonstrated that ordinary people will administer what they believe are dangerous shocks when instructed by an authority figure. Social facilitation improves performance on simple tasks in the presence of others, while social loafing reduces effort in group settings. These findings reveal how situational forces can override individual judgment.

Learning Objectives:
- Describe key experiments in conformity and obedience research
- Differentiate between normative and informational social influence
- Evaluate ethical concerns in classic social psychology studies

===

Chapter 5: Mental Health & Psychological Disorders

Psychological disorders are patterns of behavior or experience that cause significant distress or impairment. The DSM-5 classifies disorders into categories including anxiety disorders, mood disorders, and psychotic disorders. Major depressive disorder involves persistent low mood and loss of interest, while generalized anxiety disorder features chronic excessive worry. Treatment approaches include cognitive-behavioral therapy, which targets maladaptive thought patterns, and pharmacotherapy using medications like SSRIs. The biopsychosocial model recognizes that mental health arises from the interaction of biological, psychological, and social factors.

Learning Objectives:
- Explain how psychological disorders are defined and classified
- Describe symptoms of common anxiety and mood disorders
- Compare therapeutic approaches including CBT and medication`,
  },
  {
    id: 'ochem',
    title: 'Organic Chemistry',
    subject: 'Organic Chemistry',
    emoji: '\u{2697}\u{FE0F}',
    description: 'Carbon bonding, functional groups, reaction mechanisms, stereochemistry, and synthesis.',
    content: `Chapter 1: Carbon Bonding & Molecular Structure

Carbon is uniquely suited to form the backbone of organic molecules because it can form four stable covalent bonds, creating chains, branches, and rings of virtually unlimited complexity. Hybridization determines molecular geometry: sp3 carbons are tetrahedral, sp2 carbons are trigonal planar, and sp carbons are linear. Electronegativity differences between carbon and other atoms create polar bonds, and molecular polarity determines physical properties like boiling point and solubility. Lewis structures and resonance help predict electron distribution across molecules.

Learning Objectives:
- Explain why carbon is central to organic chemistry
- Predict molecular geometry from hybridization state
- Draw Lewis structures and identify resonance contributors

===

Chapter 2: Functional Groups

Functional groups are specific arrangements of atoms that determine a molecule's chemical reactivity. Alcohols (-OH) are polar and form hydrogen bonds, making small alcohols water-soluble. Carbonyls (C=O) appear in aldehydes and ketones, which undergo nucleophilic addition reactions. Carboxylic acids (-COOH) are weak acids that can donate a proton. Amines (-NH2) are bases that accept protons. Recognizing functional groups allows chemists to predict how an unfamiliar molecule will behave.

Learning Objectives:
- Identify and name the major organic functional groups
- Predict physical properties based on functional group presence
- Relate functional group structure to chemical reactivity

===

Chapter 3: Reaction Mechanisms

Organic reactions proceed through specific step-by-step pathways called mechanisms. Nucleophiles are electron-rich species that attack electron-poor electrophiles. In SN2 reactions, the nucleophile attacks simultaneously as the leaving group departs, inverting stereochemistry. SN1 reactions proceed through a carbocation intermediate, allowing racemization. Elimination reactions (E1 and E2) compete with substitution and produce alkenes. Curved-arrow notation tracks electron movement through each mechanistic step.

Learning Objectives:
- Use curved arrows to depict electron flow in mechanisms
- Compare SN1, SN2, E1, and E2 reaction pathways
- Predict which mechanism dominates given substrate and conditions

===

Chapter 4: Stereochemistry

Stereoisomers have the same connectivity but differ in spatial arrangement. A chiral center is a carbon bonded to four different groups, producing non-superimposable mirror images called enantiomers. The Cahn-Ingold-Prelog system assigns R or S configuration based on priority rules. Enantiomers have identical physical properties except for optical rotation and interaction with other chiral molecules — critical in pharmacology where one enantiomer may be therapeutic and the other harmful. Diastereomers differ at some but not all stereocenters and have different physical properties.

Learning Objectives:
- Identify chiral centers and assign R/S configuration
- Distinguish between enantiomers, diastereomers, and meso compounds
- Explain why stereochemistry matters in biological systems

===

Chapter 5: Retrosynthetic Analysis

Synthesis design works backward from the target molecule to available starting materials, a strategy called retrosynthetic analysis. Each disconnection reveals a simpler precursor and implies a forward reaction. Key transforms include Grignard reactions for forming C-C bonds, oxidation and reduction for interconverting functional groups, and protecting group strategies for selectively modifying one site. A successful synthesis minimizes steps while maximizing yield and selectivity.

Learning Objectives:
- Apply retrosynthetic analysis to simple target molecules
- Identify key bond-forming and functional group interconversion reactions
- Design a multi-step synthesis with appropriate reagent choices`,
  },
  {
    id: 'microecon',
    title: 'Microeconomics',
    subject: 'Microeconomics',
    emoji: '\u{1F4C8}',
    description: 'Supply & demand, elasticity, market structures, game theory, and externalities.',
    content: `Chapter 1: Supply & Demand

Markets coordinate exchange through the interaction of supply and demand. The demand curve slopes downward because consumers buy more at lower prices (law of demand), while the supply curve slopes upward because producers offer more at higher prices (law of supply). Equilibrium occurs where the curves intersect — at this price, quantity demanded equals quantity supplied. Shifts in demand arise from changes in income, preferences, or related goods, while shifts in supply reflect changes in input costs, technology, or regulation.

Learning Objectives:
- Graph supply and demand curves and identify equilibrium
- Distinguish between shifts of and movements along a curve
- Predict how market shocks affect equilibrium price and quantity

===

Chapter 2: Elasticity

Elasticity measures how responsive one variable is to changes in another. Price elasticity of demand captures how much quantity demanded changes when price changes — demand is elastic when the percentage change in quantity exceeds the percentage change in price, and inelastic when it does not. Necessities like insulin tend to be inelastic; luxuries like vacations tend to be elastic. Cross-price elasticity measures how demand for one good responds to the price of another, distinguishing substitutes from complements. Income elasticity classifies goods as normal or inferior.

Learning Objectives:
- Calculate price, cross-price, and income elasticity
- Classify goods by elasticity and explain the determinants
- Analyze how elasticity affects tax incidence and total revenue

===

Chapter 3: Market Structures

Markets range from perfect competition to monopoly based on the number of firms, product differentiation, and barriers to entry. In perfect competition, many firms sell identical products and are price takers. Monopolistic competition features many firms with differentiated products. Oligopolies have few dominant firms whose decisions are interdependent. A monopoly is a single seller facing the entire market demand curve. Each structure has different implications for pricing, output, efficiency, and consumer welfare.

Learning Objectives:
- Characterize the four main market structures
- Compare pricing and output decisions across structures
- Evaluate efficiency and welfare outcomes in each structure

===

Chapter 4: Game Theory & Strategic Interaction

Game theory analyzes decisions where outcomes depend on the choices of multiple players. The Prisoner's Dilemma shows how individually rational choices can lead to collectively suboptimal outcomes — both players defect even though mutual cooperation yields higher payoffs. Nash equilibrium occurs when no player can improve their payoff by unilaterally changing strategy. Repeated games allow for cooperation through strategies like tit-for-tat. These models explain pricing wars between firms, arms races, and public goods provision.

Learning Objectives:
- Set up a payoff matrix and identify dominant strategies
- Find Nash equilibria in simple games
- Explain how repeated interaction changes strategic incentives

===

Chapter 5: Externalities & Market Failure

Externalities are costs or benefits that affect parties not involved in a transaction. Pollution is a negative externality — the factory does not bear the full cost of its emissions, leading to overproduction. Education generates positive externalities — educated citizens benefit society beyond their own earnings. When externalities exist, markets produce inefficient outcomes. Solutions include Pigouvian taxes, cap-and-trade systems, subsidies, and direct regulation. The Coase theorem suggests that private bargaining can resolve externalities when property rights are clear and transaction costs are low.

Learning Objectives:
- Define positive and negative externalities with examples
- Explain why externalities cause market failure
- Compare policy tools for correcting externalities`,
  },
  {
    id: 'amgov',
    title: 'American Government',
    subject: 'American Government',
    emoji: '\u{1F3DB}\u{FE0F}',
    description: 'Constitution, federalism, Congress, the presidency, and civil liberties.',
    content: `Chapter 1: The Constitution & Founding Principles

The U.S. Constitution, ratified in 1788, established a framework of limited government built on popular sovereignty, separation of powers, and checks and balances. The Framers divided authority among three branches — legislative, executive, and judicial — so that no single branch could dominate. The amendment process (Article V) allows the document to evolve; the Bill of Rights, ratified in 1791, added protections for individual liberties that Anti-Federalists demanded. Constitutional interpretation continues through judicial review, established by Marbury v. Madison in 1803.

Learning Objectives:
- Identify the core principles embedded in the Constitution
- Explain how separation of powers and checks and balances function
- Describe the amendment process and the significance of judicial review

===

Chapter 2: Federalism

Federalism divides governing authority between the national government and the states. The Constitution enumerates specific federal powers (like regulating interstate commerce), reserves others to the states (via the Tenth Amendment), and shares some concurrently (like taxation). The balance has shifted over time: dual federalism treated state and federal spheres as distinct, while cooperative federalism blurs those lines through grants-in-aid and federal mandates. Debates over federal versus state authority remain central to issues like healthcare, marijuana legalization, and immigration policy.

Learning Objectives:
- Distinguish between enumerated, reserved, and concurrent powers
- Trace the evolution from dual to cooperative federalism
- Analyze how federalism shapes contemporary policy debates

===

Chapter 3: Congress — Structure & Lawmaking

Congress is a bicameral legislature consisting of the House of Representatives (435 members, two-year terms) and the Senate (100 members, six-year terms). A bill must pass both chambers in identical form before reaching the president. The committee system is where most legislative work occurs — committees hold hearings, mark up bills, and control the agenda. Party leadership, including the Speaker of the House and Senate Majority Leader, shapes priorities. Congressional powers include taxing, spending, declaring war, and oversight of the executive branch.

Learning Objectives:
- Compare the structure and roles of the House and Senate
- Outline the steps in the legislative process from bill to law
- Explain the committee system and the role of party leadership

===

Chapter 4: The Presidency & Executive Power

The president serves as head of state, commander in chief, and chief diplomat. Constitutional powers include signing or vetoing legislation, issuing executive orders, and nominating judges. Modern presidents have expanded executive authority through executive agreements, signing statements, and unilateral military action. The Executive Office of the President and the Cabinet help manage a vast bureaucracy. Presidential power is checked by congressional oversight, the power of the purse, and judicial review.

Learning Objectives:
- Enumerate the formal and informal powers of the president
- Analyze how executive power has expanded beyond the original text
- Evaluate the effectiveness of checks on presidential authority

===

Chapter 5: Civil Liberties & Civil Rights

Civil liberties are constitutional protections against government action — the First Amendment protects speech, religion, press, and assembly; the Fourth Amendment guards against unreasonable searches. The incorporation doctrine, through the Fourteenth Amendment's Due Process Clause, extended most Bill of Rights protections to state governments. Civil rights, by contrast, concern equal treatment and protection from discrimination. Landmark cases like Brown v. Board of Education and legislation like the Civil Rights Act of 1964 dismantled legal segregation, though struggles over voting rights, policing, and equality persist.

Learning Objectives:
- Distinguish between civil liberties and civil rights
- Explain the incorporation doctrine and its significance
- Analyze landmark cases that shaped individual rights`,
  },
  {
    id: 'cellbio',
    title: 'Cell & Molecular Biology',
    subject: 'Biology: Cell & Molecular',
    emoji: '\u{1F9EC}',
    description: 'Cell structure, DNA replication, gene expression, cell signaling, and metabolism.',
    content: `Chapter 1: Cell Structure & Organelles

All living organisms are composed of cells, the basic units of life. Eukaryotic cells contain membrane-bound organelles that compartmentalize functions: the nucleus houses DNA, mitochondria generate ATP through oxidative phosphorylation, the endoplasmic reticulum folds proteins and synthesizes lipids, and the Golgi apparatus modifies and sorts proteins for export. The cytoskeleton — composed of microtubules, microfilaments, and intermediate filaments — provides structural support and enables intracellular transport. The plasma membrane's fluid mosaic of phospholipids and proteins controls what enters and exits the cell.

Learning Objectives:
- Identify the major organelles and their functions
- Explain the fluid mosaic model of the plasma membrane
- Describe the components and roles of the cytoskeleton

===

Chapter 2: DNA Replication

Before a cell divides, it must faithfully copy its entire genome. Replication begins at origins of replication where helicase unwinds the double helix, creating replication forks. DNA polymerase III synthesizes the new strand in the 5' to 3' direction, adding complementary nucleotides with extraordinary accuracy. The leading strand is synthesized continuously, while the lagging strand is built in short Okazaki fragments that are later joined by ligase. Proofreading by DNA polymerase and mismatch repair enzymes keep the error rate below one in a billion base pairs.

Learning Objectives:
- Outline the steps of semiconservative DNA replication
- Explain the roles of helicase, primase, polymerase, and ligase
- Describe how proofreading and repair maintain genome integrity

===

Chapter 3: Gene Expression — Transcription & Translation

Gene expression converts DNA information into functional proteins through two steps. Transcription, occurring in the nucleus, uses RNA polymerase to synthesize a messenger RNA (mRNA) copy from a DNA template. The mRNA is processed — capped, polyadenylated, and spliced to remove introns — before export to the cytoplasm. Translation occurs on ribosomes, where transfer RNAs (tRNAs) deliver amino acids matching each mRNA codon. The genetic code is nearly universal: 64 codons specify 20 amino acids plus start and stop signals.

Learning Objectives:
- Describe the stages of transcription and mRNA processing
- Explain how ribosomes translate mRNA into polypeptides
- Interpret the genetic code and predict amino acid sequences from mRNA

===

Chapter 4: Cell Signaling

Cells communicate through signaling pathways that detect external stimuli and trigger internal responses. A ligand binds to a receptor on the cell surface or inside the cell. Receptor tyrosine kinases, G-protein-coupled receptors, and ion channel receptors initiate different cascades. Signal transduction often involves second messengers like cAMP or calcium ions that amplify the signal through a phosphorylation cascade. The response may include changes in gene expression, metabolism, or cell shape. Defects in signaling pathways are implicated in cancer and many other diseases.

Learning Objectives:
- Outline the general steps: reception, transduction, and response
- Compare major receptor types and their signaling mechanisms
- Explain signal amplification and the role of second messengers

===

Chapter 5: Cellular Metabolism — Respiration & Photosynthesis

Metabolism encompasses all chemical reactions in a cell. Cellular respiration breaks down glucose to produce ATP: glycolysis in the cytoplasm yields 2 ATP and pyruvate, the citric acid cycle in the mitochondrial matrix generates electron carriers, and the electron transport chain uses those carriers to produce approximately 34 ATP via chemiosmosis. Photosynthesis in chloroplasts runs complementary reactions: the light reactions capture solar energy to split water and produce ATP and NADPH, while the Calvin cycle fixes carbon dioxide into glucose.

Learning Objectives:
- Trace the flow of energy through glycolysis, the citric acid cycle, and oxidative phosphorylation
- Compare aerobic and anaerobic respiration
- Explain how the light reactions and Calvin cycle are coupled`,
  },
  {
    id: 'ethics',
    title: 'Philosophy: Ethics',
    subject: 'Philosophy: Ethics',
    emoji: '\u{2696}\u{FE0F}',
    description: 'Utilitarianism, deontology, virtue ethics, social contract, and applied ethics.',
    content: `Chapter 1: Utilitarianism

Utilitarianism, developed by Jeremy Bentham and refined by John Stuart Mill, holds that the morally right action is the one that produces the greatest overall happiness. Bentham proposed a "felicific calculus" to quantify pleasure and pain across affected parties. Mill distinguished between higher and lower pleasures, arguing that intellectual satisfactions outweigh bodily ones. Act utilitarianism evaluates each action by its consequences, while rule utilitarianism asks which rules, if generally followed, would maximize utility. Critics argue the theory can justify harming minorities if it benefits the majority.

Learning Objectives:
- State the principle of utility and its origins
- Distinguish between act and rule utilitarianism
- Evaluate common objections to utilitarian reasoning

===

Chapter 2: Deontological Ethics

Immanuel Kant argued that morality is grounded in duty and rational principle, not outcomes. His categorical imperative commands us to act only according to maxims we could will to be universal laws — lying fails this test because a world of universal lying would be self-defeating. A second formulation requires treating persons always as ends in themselves, never merely as means. Deontology provides clear moral rules and respects individual rights, but critics note it can be rigid in cases where following a rule leads to terrible consequences, such as telling the truth to a murderer.

Learning Objectives:
- Explain the categorical imperative and its formulations
- Contrast deontology with consequentialist theories
- Analyze situations where duty-based reasoning is challenged

===

Chapter 3: Virtue Ethics

Virtue ethics, rooted in Aristotle, focuses on character rather than rules or consequences. A virtuous person cultivates traits like courage, temperance, justice, and practical wisdom (phronesis) through habit and practice. Aristotle defined virtue as a mean between excess and deficiency — courage lies between recklessness and cowardice. Eudaimonia, often translated as "flourishing," is the goal of a virtuous life. Modern virtue ethicists like Alasdair MacIntyre argue that virtues are embedded in social practices and traditions. Critics question how to resolve conflicts between virtues and worry about cultural relativism.

Learning Objectives:
- Define virtue, the doctrine of the mean, and eudaimonia
- Explain how virtue ethics differs from rule-based approaches
- Assess strengths and weaknesses of character-based moral theory

===

Chapter 4: Social Contract Theory

Social contract theorists ask what moral and political rules rational people would agree to under fair conditions. Thomas Hobbes argued that without government life would be "nasty, brutish, and short," so people consent to a sovereign for security. John Locke held that government must protect natural rights to life, liberty, and property — and can be overthrown if it fails. John Rawls proposed the "veil of ignorance": just principles are those we would choose if we did not know our place in society. This thought experiment yields two principles — equal basic liberties and the difference principle, which permits inequality only if it benefits the least advantaged.

Learning Objectives:
- Compare the social contracts proposed by Hobbes, Locke, and Rawls
- Explain the veil of ignorance and its implications
- Evaluate social contract theory as a foundation for justice

===

Chapter 5: Applied Ethics

Applied ethics brings theoretical frameworks to real-world dilemmas. Bioethics examines issues like euthanasia, genetic engineering, and informed consent — balancing patient autonomy against potential harms. Environmental ethics asks whether non-human entities have moral standing and how to weigh present consumption against future sustainability. Business ethics explores corporate responsibility, whistleblowing, and fair labor practices. In each domain, competing frameworks often yield different conclusions, and practitioners must weigh principles, consequences, character, and social agreements to navigate genuine moral complexity.

Learning Objectives:
- Apply ethical frameworks to bioethical, environmental, and business dilemmas
- Identify where different theories converge and diverge on specific issues
- Develop a reasoned position on a contemporary ethical controversy`,
  },
];
