import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronDown, Check, X, Trophy, Star, BookOpen, Target, ArrowLeft, Lightbulb, Eye, GraduationCap } from "lucide-react";

const T = {
  bg:'#080c18', surface:'#0f1628', surfaceLight:'#182040',
  accent:'#c9a227', accentDim:'#c9a22730', accentLight:'#e8c84a',
  blue:'#5b8def', blueDim:'#5b8def25',
  ok:'#34d399', okDim:'#34d39920',
  err:'#f472b6', errDim:'#f472b620',
  text:'#e8e6e3', textMuted:'#7a7d8e', textDim:'#4a4d5e',
  border:'#1e2545', borderLight:'#2a3060',
};
const FONT = "'Crimson Pro','Georgia',serif";
const BODY = "'Inter',system-ui,sans-serif";
const MONO = "'JetBrains Mono','Fira Code',monospace";

const CHAPTERS = [
{
  id:'reals', num:1, title:'The Real Numbers', subtitle:'Completeness and the Least Upper Bound Property',
  defs:[
    { term:'Ordered Field Axioms', formal:'ℝ is a field (closed under +, ×, with identities 0 and 1, inverses, and distributivity) equipped with a total order < compatible with the field operations: if a < b then a + c < b + c, and if a < b and c > 0 then ac < bc.',
      intuition:'The rationals ℚ already satisfy all the field and order axioms. So these axioms alone don\'t distinguish ℝ from ℚ. The real numbers need something more — completeness — to fill in the "gaps" that ℚ has.',
      example:'In ℚ: 2 + 3 = 5 ∈ ℚ, 2 × 3 = 6 ∈ ℚ, 2 < 3 and 2+1 < 3+1. All field/order axioms hold. But {x ∈ ℚ : x² < 2} has no least upper bound in ℚ.'
    },
    { term:'Supremum (Least Upper Bound)', formal:'Let S ⊆ ℝ be nonempty and bounded above. The supremum sup S is the smallest upper bound: (1) s ≤ sup S for all s ∈ S, and (2) if M is any upper bound of S, then sup S ≤ M.',
      intuition:'Imagine S is a collection of people\'s heights. The supremum is the lowest ceiling that nobody bumps their head on. It might be someone\'s exact height (if the tallest person exists), or it might be a value nobody quite reaches but everyone gets arbitrarily close to.',
      example:'sup{1/n : n ∈ ℕ} = 1 (achieved at n=1). sup{x ∈ ℝ : x² < 2} = √2 (not achieved — no element of S equals √2).'
    },
    { term:'Completeness Axiom (LUB Property)', formal:'Every nonempty subset of ℝ that is bounded above has a least upper bound (supremum) in ℝ.',
      intuition:'This is THE axiom that separates ℝ from ℚ. It says there are no "holes" in the real line. Every time you draw a boundary, the boundary point itself exists. The rationals fail this — the set {x ∈ ℚ : x² < 2} is bounded above in ℚ but has no rational supremum.',
      example:'S = (0, 1) has sup S = 1 ∈ ℝ. The completeness axiom guarantees this. In ℚ, the set {q ∈ ℚ : q² < 2} has no sup in ℚ because √2 ∉ ℚ.'
    },
    { term:'Infimum (Greatest Lower Bound)', formal:'The infimum inf S is the greatest lower bound of S: (1) inf S ≤ s for all s ∈ S, and (2) if m is any lower bound, then m ≤ inf S. By completeness, every nonempty set bounded below has an infimum in ℝ.',
      intuition:'The infimum is the highest floor that stays below everything in S. It\'s the mirror image of supremum. You can derive its existence from the LUB property by considering −S = {−s : s ∈ S} and noting inf S = −sup(−S).',
      example:'inf{1/n : n ∈ ℕ} = 0. Note 0 ∉ S, but 1/n gets arbitrarily close to 0.'
    }
  ],
  explained:[
    { id:'r1', difficulty:1, statement:'Prove that sup{n/(n+1) : n ∈ ℕ} = 1.',
      steps:[
        {title:'Show 1 is an upper bound', content:'For all n ∈ ℕ, n/(n+1) = 1 − 1/(n+1) < 1. So 1 is an upper bound of S.'},
        {title:'Show no smaller number is an upper bound', content:'Let M < 1. We need to find n ∈ ℕ with n/(n+1) > M. This means 1 − 1/(n+1) > M, so 1/(n+1) < 1 − M.'},
        {title:'Apply the Archimedean property', content:'Choose n > 1/(1−M) − 1 (possible by the Archimedean property). Then 1/(n+1) < 1−M, so n/(n+1) > M. Therefore M is not an upper bound, and sup S = 1. ∎'}
      ], answer:'sup S = 1'
    },
    { id:'r2', difficulty:2, statement:'Prove: for any a,b ∈ ℝ with a < b, there exists r ∈ ℚ with a < r < b (Density of ℚ in ℝ).',
      steps:[
        {title:'Use the Archimedean property to find a denominator', content:'Since b − a > 0, by the Archimedean property there exists n ∈ ℕ with 1/n < b − a, equivalently n(b−a) > 1.'},
        {title:'Find the right numerator', content:'Let m = ⌊na⌋ + 1 (the smallest integer greater than na). Then m − 1 ≤ na < m, so a < m/n.'},
        {title:'Verify m/n < b', content:'Since m ≤ na + 1, we get m/n ≤ a + 1/n < a + (b − a) = b. Therefore a < m/n < b and r = m/n ∈ ℚ. ∎'},
        {title:'Key insight', content:'This proof uses completeness indirectly: the Archimedean property itself follows from the completeness of ℝ. In a non-Archimedean ordered field, the rationals would not be dense.'}
      ], answer:'r = m/n where n > 1/(b−a), m = ⌊na⌋+1'
    },
    { id:'r3', difficulty:3, statement:'Prove that √2 is irrational.',
      steps:[
        {title:'Assume for contradiction', content:'Suppose √2 = p/q where p,q ∈ ℤ, q ≠ 0, and gcd(p,q) = 1 (reduced form).'},
        {title:'Square both sides', content:'2 = p²/q², so p² = 2q². This means p² is even, so p is even (since odd² = odd). Write p = 2k.'},
        {title:'Derive a contradiction', content:'Then (2k)² = 2q², so 4k² = 2q², giving q² = 2k². So q² is even, hence q is even.'},
        {title:'Conclude', content:'Both p and q are even, contradicting gcd(p,q) = 1. Therefore √2 ∉ ℚ. ∎ This also shows that ℚ is "incomplete" — {x ∈ ℚ : x² < 2} is bounded above but has no rational sup.'}
      ], answer:'√2 ∉ ℚ (proof by contradiction)'
    },
    { id:'r4', difficulty:4, statement:'Let A,B be nonempty subsets of ℝ with a ≤ b for all a ∈ A, b ∈ B. Prove sup A ≤ inf B.',
      steps:[
        {title:'Fix an arbitrary b ∈ B', content:'For every a ∈ A, we have a ≤ b. So b is an upper bound of A. By definition of supremum, sup A ≤ b.'},
        {title:'Now vary b', content:'The inequality sup A ≤ b holds for every b ∈ B. So sup A is a lower bound of B.'},
        {title:'Apply definition of infimum', content:'Since sup A is a lower bound of B, and inf B is the greatest lower bound, we get sup A ≤ inf B. ∎'},
        {title:'Why this matters', content:'This is the basis for Dedekind cuts: you can define real numbers as "cuts" in ℚ where everything on the left ≤ everything on the right. The completeness of ℝ ensures the cut point exists.'}
      ], answer:'sup A ≤ inf B'
    },
    { id:'r5', difficulty:5, statement:'Prove: if S ⊆ ℝ is nonempty and bounded above, and s₀ = sup S, then for every ε > 0, there exists x ∈ S with s₀ − ε < x ≤ s₀.',
      steps:[
        {title:'Use the characterization of sup', content:'Since s₀ = sup S, we know s₀ is an upper bound, so x ≤ s₀ for all x ∈ S. We need to show the other part: s₀ − ε is NOT an upper bound.'},
        {title:'Apply the "least" part', content:'Since s₀ is the LEAST upper bound and s₀ − ε < s₀, the number s₀ − ε cannot be an upper bound of S.'},
        {title:'Extract the element', content:'Since s₀ − ε is not an upper bound, there exists x ∈ S with x > s₀ − ε. Combined with x ≤ s₀ (since s₀ is an upper bound), we get s₀ − ε < x ≤ s₀. ∎'},
        {title:'This is the ε-characterization of sup', content:'This lemma is used constantly in analysis. It converts the abstract definition of sup into a concrete tool: "I can find elements of S arbitrarily close to sup S." It\'s the bridge between the completeness axiom and ε-δ arguments.'}
      ], answer:'∃x ∈ S: s₀ − ε < x ≤ s₀ (ε-characterization of sup)'
    }
  ],
  practice:[
    { id:'rp1', difficulty:1, statement:'Find sup S and inf S where S = {(−1)ⁿ/n : n ∈ ℕ}. S = {−1, 1/2, −1/3, 1/4, −1/5, ...}',
      steps:[
        { question:'What is the supremum of S?', options:['1/2','1','0','Does not exist'],correct:0,
          explanations:['Correct! The positive terms are 1/2, 1/4, 1/6, ... and the largest is 1/2. All negative terms are below 1/2, so sup S = 1/2.','1 is not in S and no element exceeds 1/2, so 1 is an upper bound but not the least one.','0 is not an upper bound since 1/2 ∈ S and 1/2 > 0.','S is bounded above (by 1/2), so sup exists by completeness.']},
        { question:'What is the infimum of S?', options:['−1','−1/2','0','−∞'],correct:0,
          explanations:['Correct! −1 ∈ S (when n=1) and all other terms are > −1, so inf S = −1 and it is achieved.','−1 ∈ S and −1 < −1/2, so −1/2 is not a lower bound.','0 is not a lower bound since −1 ∈ S.','S is bounded below (by −1), so inf is finite.']},
        { question:'Is the supremum achieved (i.e., is sup S ∈ S)?', options:['Yes, at n = 2','No, it is a limit point only','Yes, at n = 1','Depends on the indexing'],correct:0,
          explanations:['Correct! When n=2, (−1)²/2 = 1/2 = sup S. The sup is achieved.','1/2 is actually in S: when n = 2, we get (−1)²/2 = 1/2.','At n=1, (−1)¹/1 = −1, which is inf S, not sup S.','The supremum is a fixed value determined by S, not the indexing.']}
      ]
    },
    { id:'rp2', difficulty:3, statement:'Let S = {x ∈ ℝ : x² + x − 2 < 0}. Find sup S and inf S.',
      steps:[
        { question:'What is the solution set of x² + x − 2 < 0?', options:['(−2, 1)','(−∞, −2) ∪ (1, ∞)','[−2, 1]','(−1, 2)'],correct:0,
          explanations:['Correct! x² + x − 2 = (x+2)(x−1) < 0 when exactly one factor is negative, which happens for x ∈ (−2, 1).','That\'s where (x+2)(x−1) > 0. We need it negative.','The inequality is strict (<, not ≤), so endpoints are excluded.','Factor carefully: x² + x − 2 = (x+2)(x−1), roots at −2 and 1.']},
        { question:'What is sup S?', options:['1','2','1/2','∞'],correct:0,
          explanations:['Correct! S = (−2,1), so sup S = 1. Note 1 ∉ S but elements get arbitrarily close.','2 is an upper bound but not the least one.','1/2 ∈ S but there are larger elements like 0.99.','S is bounded, so sup is finite.']},
        { question:'Are the sup and inf achieved (belong to S)?', options:['Neither is achieved','Both are achieved','Only sup is achieved','Only inf is achieved'],correct:0,
          explanations:['Correct! S = (−2,1) is open, so neither endpoint belongs to S. sup S = 1 ∉ S and inf S = −2 ∉ S.','S is an open interval, so the endpoints are excluded.','At x = 1: x² + x − 2 = 0, not < 0, so 1 ∉ S.','At x = −2: x² + x − 2 = 0, not < 0, so −2 ∉ S.']}
      ]
    },
    { id:'rp3', difficulty:5, statement:'Prove or disprove: if S, T ⊆ ℝ are nonempty and bounded above, then sup(S ∪ T) = max{sup S, sup T}.',
      steps:[
        { question:'Let α = sup S, β = sup T, and γ = max{α,β}. Is γ an upper bound of S ∪ T?', options:['Yes: every element of S is ≤ α ≤ γ and every element of T is ≤ β ≤ γ','No: γ might be less than some element of S ∪ T','Only if α = β','Only if S ∩ T ≠ ∅'],correct:0,
          explanations:['Correct! If x ∈ S then x ≤ α ≤ γ; if x ∈ T then x ≤ β ≤ γ. So γ is an upper bound of S ∪ T.','Since γ ≥ α = sup S and γ ≥ β = sup T, it bounds both sets.','The argument works regardless of whether α = β.','Disjointness doesn\'t matter here.']},
        { question:'Is γ the LEAST upper bound? Suppose M < γ. Can we find x ∈ S ∪ T with x > M?', options:['Yes: if γ = α then M < sup S so ∃x ∈ S with x > M; similarly if γ = β','Not necessarily','Only if M < both α and β','We need an additional axiom'],correct:0,
          explanations:['Correct! WLOG γ = α. Since M < α = sup S, by the ε-characterization of sup, ∃x ∈ S ⊆ S∪T with x > M. So M is not an upper bound of S∪T.','This follows directly from the ε-characterization of sup applied to whichever set determines γ.','We only need M < γ = max{α,β}, so M is less than at least one of them.','No — this follows from the completeness axiom we already have.']},
        { question:'What is the conclusion?', options:['The statement is TRUE: sup(S∪T) = max{sup S, sup T}','The statement is FALSE','TRUE only when S ∩ T = ∅','TRUE only when sup S = sup T'],correct:0,
          explanations:['Correct! We showed γ = max{sup S, sup T} is an upper bound and no smaller number is. So sup(S∪T) = max{sup S, sup T}. This generalizes to finite unions. ∎','We just proved it — γ is the least upper bound of S ∪ T.','It works for all nonempty bounded S, T regardless of overlap.','The proof works for any α, β — they need not be equal.']}
      ]
    }
  ]
},
{
  id:'sequences', num:2, title:'Sequences & Convergence', subtitle:'ε-N definitions and the Bolzano–Weierstrass theorem',
  defs:[
    { term:'Convergence of a Sequence', formal:'A sequence (aₙ) converges to L ∈ ℝ if for every ε > 0, there exists N ∈ ℕ such that for all n ≥ N, |aₙ − L| < ε. We write aₙ → L or lim aₙ = L.',
      intuition:'After some point N, every term of the sequence is trapped within ε of L. The key: YOU choose ε first (any positive number, no matter how small), and then I have to produce an N that works. If I can always do this, the sequence converges.',
      example:'aₙ = 1/n → 0. Given ε > 0, choose N > 1/ε. Then for n ≥ N: |1/n − 0| = 1/n ≤ 1/N < ε.'
    },
    { term:'Bounded and Monotone Sequences', formal:'(aₙ) is bounded if there exists M > 0 with |aₙ| ≤ M for all n. It is monotone increasing if aₙ ≤ aₙ₊₁ for all n, and monotone decreasing if aₙ ≥ aₙ₊₁ for all n.',
      intuition:'Bounded means the sequence lives in a box [−M, M]. Monotone means it only moves in one direction. The Monotone Convergence Theorem says: bounded + monotone ⟹ convergent. The sequence is "trapped and can\'t oscillate," so it must settle down.',
      example:'aₙ = 1 − 1/n is increasing and bounded above by 1, so it converges (to 1). The sequence (−1)ⁿ is bounded but not monotone, and it diverges.'
    },
    { term:'Cauchy Sequence', formal:'(aₙ) is Cauchy if for every ε > 0, there exists N ∈ ℕ such that for all m,n ≥ N, |aₘ − aₙ| < ε.',
      intuition:'The terms get arbitrarily close TO EACH OTHER, not to a specific limit. The remarkable fact: in ℝ, Cauchy ⟺ convergent. This is another way to state completeness — it means you can verify convergence without knowing the limit.',
      example:'aₙ = Σᵢ₌₁ⁿ 1/i² is Cauchy (it converges to π²/6). The partial sums of the harmonic series aₙ = Σ 1/i are NOT Cauchy (they diverge to ∞).'
    },
    { term:'Bolzano–Weierstrass Theorem', formal:'Every bounded sequence in ℝ has a convergent subsequence.',
      intuition:'If you have infinitely many points packed in a finite interval, they must "pile up" somewhere. That pile-up point is the limit of a subsequence. The proof uses repeated bisection: split the interval in half, take the half with infinitely many terms, repeat.',
      example:'(−1)ⁿ is bounded. Subsequence (−1)²ⁿ = 1, 1, 1, ... → 1. Also (−1)²ⁿ⁺¹ = −1, −1, ... → −1. Both are convergent subsequences.'
    }
  ],
  explained:[
    { id:'s1', difficulty:1, statement:'Prove from the definition that lim(n→∞) 1/n² = 0.',
      steps:[
        {title:'Set up the ε-N framework', content:'Let ε > 0 be given. We need N ∈ ℕ such that n ≥ N ⟹ |1/n² − 0| < ε, i.e., 1/n² < ε.'},
        {title:'Solve for N', content:'1/n² < ε ⟺ n² > 1/ε ⟺ n > 1/√ε. Choose N = ⌈1/√ε⌉ + 1.'},
        {title:'Verify', content:'For n ≥ N > 1/√ε: n² > 1/ε, so 1/n² < ε. ∎ Note: 1/n² ≤ 1/n for n ≥ 1, so convergence of 1/n also implies convergence of 1/n² (but this direct proof gives a tighter N).'}
      ], answer:'lim 1/n² = 0'
    },
    { id:'s2', difficulty:2, statement:'Prove that if aₙ → L and bₙ → M, then aₙ + bₙ → L + M.',
      steps:[
        {title:'Set up with ε/2', content:'Let ε > 0. Since aₙ → L, ∃N₁ such that n ≥ N₁ ⟹ |aₙ − L| < ε/2. Since bₙ → M, ∃N₂ such that n ≥ N₂ ⟹ |bₙ − M| < ε/2.'},
        {title:'Combine', content:'Let N = max{N₁, N₂}. For n ≥ N: |(aₙ + bₙ) − (L + M)| = |(aₙ − L) + (bₙ − M)| ≤ |aₙ − L| + |bₙ − M| (triangle inequality).'},
        {title:'Finish', content:'< ε/2 + ε/2 = ε. ∎ The key technique is the ε/2 trick: allocate half the error budget to each sequence. This generalizes to finite sums.'},
      ], answer:'aₙ + bₙ → L + M'
    },
    { id:'s3', difficulty:3, statement:'Prove the Monotone Convergence Theorem: if (aₙ) is increasing and bounded above, then (aₙ) converges.',
      steps:[
        {title:'Identify the candidate limit', content:'Let S = {aₙ : n ∈ ℕ}. S is nonempty and bounded above, so by the Completeness Axiom, L = sup S exists.'},
        {title:'Show aₙ → L', content:'Let ε > 0. By the ε-characterization of sup, ∃aN ∈ S with L − ε < aN ≤ L. That is, there exists N with L − ε < aₙ.'},
        {title:'Use monotonicity', content:'Since (aₙ) is increasing, for all n ≥ N: aₙ ≥ aN > L − ε. Also aₙ ≤ L (since L is an upper bound). So |aₙ − L| = L − aₙ < ε.'},
        {title:'Conclude', content:'For all n ≥ N, |aₙ − L| < ε, so aₙ → L = sup{aₙ}. ∎ Note: this is where completeness is essential. In ℚ, the sequence 1, 1.4, 1.41, 1.414, ... is increasing and bounded but has no rational limit.'}
      ], answer:'aₙ → sup{aₙ : n ∈ ℕ}'
    },
    { id:'s4', difficulty:4, statement:'Define aₙ recursively by a₁ = 1, aₙ₊₁ = (aₙ + 3/aₙ)/2. Prove (aₙ) converges and find its limit.',
      steps:[
        {title:'Guess the limit', content:'IF aₙ → L, then L = (L + 3/L)/2, so 2L = L + 3/L, giving L = 3/L, hence L² = 3, L = √3 (taking positive root since aₙ > 0).'},
        {title:'Show aₙ ≥ √3 for n ≥ 2', content:'aₙ₊₁ = (aₙ + 3/aₙ)/2 ≥ √(aₙ · 3/aₙ) = √3 by AM-GM. So aₙ ≥ √3 for all n ≥ 2.'},
        {title:'Show (aₙ) is decreasing for n ≥ 2', content:'aₙ₊₁ − aₙ = (aₙ + 3/aₙ)/2 − aₙ = (3/aₙ − aₙ)/2 = (3 − aₙ²)/(2aₙ) ≤ 0 when aₙ² ≥ 3, which holds for n ≥ 2.'},
        {title:'Conclude by MCT', content:'(aₙ)ₙ≥₂ is decreasing and bounded below by √3, so by the Monotone Convergence Theorem it converges. The limit satisfies L = √3. ∎ This is Newton\'s method for √3.'}
      ], answer:'aₙ → √3'
    },
    { id:'s5', difficulty:5, statement:'Prove that every Cauchy sequence in ℝ converges.',
      steps:[
        {title:'Step 1: Cauchy ⟹ bounded', content:'Let (aₙ) be Cauchy. Taking ε = 1, ∃N with |aₘ − aₙ| < 1 for m,n ≥ N. So for n ≥ N, |aₙ| ≤ |aₙ| + 1. Set M = max{|a₁|,...,|aₙ₋₁|, |aₙ|+1}. Then |aₙ| ≤ M for all n.'},
        {title:'Step 2: Extract a convergent subsequence', content:'By Bolzano–Weierstrass, (aₙ) has a convergent subsequence aₙₖ → L.'},
        {title:'Step 3: The full sequence converges to L', content:'Let ε > 0. Since (aₙ) is Cauchy, ∃N₁ with |aₘ − aₙ| < ε/2 for m,n ≥ N₁. Since aₙₖ → L, ∃K with |aₙₖ − L| < ε/2 for nₖ ≥ N₂.'},
        {title:'Combine', content:'Choose n ≥ max{N₁, N₂} and pick nₖ ≥ max{N₁, N₂}. Then |aₙ − L| ≤ |aₙ − aₙₖ| + |aₙₖ − L| < ε/2 + ε/2 = ε. ∎ This proves ℝ is a complete metric space.'}
      ], answer:'Every Cauchy sequence in ℝ converges (completeness)'
    }
  ],
  practice:[
    { id:'sp1', difficulty:1, statement:'Prove from the ε-N definition that lim(n→∞) (3n+1)/(n+2) = 3.',
      steps:[
        { question:'Simplify |(3n+1)/(n+2) − 3|. What do you get?', options:['5/(n+2)','(3n+1−3n−6)/(n+2) = −5/(n+2), so absolute value is 5/(n+2)','1/(n+2)','3/(n+2)'],correct:1,
          explanations:['Close — you need to show the work. (3n+1)/(n+2) − 3 = (3n+1−3(n+2))/(n+2) = −5/(n+2).','Correct! |(3n+1)/(n+2) − 3| = |−5/(n+2)| = 5/(n+2). Now we need this < ε.','That would be the case for (n+1)/(n+2) − 1, not our expression.','Compute: 3n+1 − 3(n+2) = 3n+1−3n−6 = −5, so it\'s 5/(n+2).']},
        { question:'To make 5/(n+2) < ε, what should N be?', options:['N > 5/ε − 2','N > 5/ε','N > ε/5','N > 2/ε'],correct:0,
          explanations:['Correct! 5/(n+2) < ε ⟺ n+2 > 5/ε ⟺ n > 5/ε − 2. So choose N = ⌈5/ε − 2⌉ + 1.','That gives 5/(n+2) < 5/(5/ε) = ε·(5/ε)/(5/ε+2)... close but not tight.','ε/5 would mean 5/(n+2) < 5/(ε/5) = 25/ε, which goes the wrong way.','That would give 5/(n+2) which isn\'t necessarily < ε.']},
        { question:'For n ≥ N where N > 5/ε − 2, which chain of inequalities completes the proof?', options:['|aₙ − 3| = 5/(n+2) ≤ 5/(N+2) < 5/(5/ε) = ε','|aₙ − 3| = 5/(n+2) < 5/n < ε','|aₙ − 3| < 1/n < ε','|aₙ − 3| = 5/(n+2) < ε/(n+2) < ε'],correct:0,
          explanations:['Correct! Since n ≥ N > 5/ε − 2, we have n + 2 > 5/ε, so 5/(n+2) < ε. This completes the ε-N proof. ∎','5/(n+2) < 5/n is true but then 5/n < ε requires n > 5/ε, which is a different N.','|aₙ − 3| = 5/(n+2), not 1/n.','The numerator is 5, not ε.']}
      ]
    },
    { id:'sp2', difficulty:3, statement:'Let a₁ = 2, aₙ₊₁ = (aₙ + 2)/2. Determine whether (aₙ) converges and find its limit if so.',
      steps:[
        { question:'If L = lim aₙ exists, what equation must L satisfy?', options:['L = (L + 2)/2, so L = 2','L = L/2 + 1, so L = 2','Both A and B (they are the same equation)','L = 2L − 2, so L = 2'],correct:2,
          explanations:['This is correct! L = (L+2)/2 gives 2L = L + 2, so L = 2.','This is also correct — it\'s the same equation rearranged.','Correct! Both expressions simplify to L = 2. The fixed point is 2.','L = (L+2)/2 gives 2L = L+2, i.e., L = 2. The equation L = 2L−2 gives L = 2 as well, but that\'s not what our recurrence says.']},
        { question:'Show (aₙ) is monotone. Since a₁=2 and a₂=(2+2)/2=2, what happens?', options:['aₙ = 2 for all n (constant sequence)','aₙ is decreasing','aₙ is increasing','aₙ oscillates'],correct:0,
          explanations:['Correct! a₁ = 2, a₂ = 2, and by induction if aₙ = 2 then aₙ₊₁ = (2+2)/2 = 2. The sequence is constant!','Since a₁ = a₂ = 2, there\'s no decrease.','It\'s constant from the start.','All terms equal 2, so no oscillation.']},
        { question:'What is lim aₙ?', options:['2','∞','Does not exist','0'],correct:0,
          explanations:['Correct! aₙ = 2 for all n, so lim aₙ = 2. This is a degenerate case where the initial condition IS the fixed point. Try a₁ = 0: you\'d get 0, 1, 3/2, 7/4, ... → 2 (increasing).','A constant bounded sequence converges.','A constant sequence always converges.','Every term is 2, not 0.']}
      ]
    },
    { id:'sp3', difficulty:5, statement:'Prove: if (aₙ) is bounded and every convergent subsequence has the same limit L, then aₙ → L.',
      steps:[
        { question:'Assume for contradiction that aₙ does not converge to L. What does this mean in ε-N terms?', options:['∃ε₀ > 0 such that for all N, ∃n ≥ N with |aₙ − L| ≥ ε₀','∀ε > 0, ∀N, ∃n ≥ N with |aₙ − L| ≥ ε','The sequence is unbounded','aₙ → M for some M ≠ L'],correct:0,
          explanations:['Correct! Negating convergence: there is a fixed ε₀ such that infinitely many terms are ε₀-far from L. This gives us a subsequence bounded away from L.','The ε₀ must be fixed (existential, not universal). One particular ε₀ suffices for contradiction.','We assumed (aₙ) is bounded.','We haven\'t assumed it converges to anything else.']},
        { question:'From the negation, we extract a subsequence (aₙₖ) with |aₙₖ − L| ≥ ε₀ for all k. Now what?', options:['(aₙₖ) is bounded, so by Bolzano–Weierstrass it has a convergent sub-subsequence','(aₙₖ) must diverge','We immediately have a contradiction','We need to apply the Cauchy criterion'],correct:0,
          explanations:['Correct! (aₙₖ) is a bounded sequence (since (aₙ) is bounded), so Bolzano–Weierstrass gives a convergent sub-subsequence aₙₖⱼ → M for some M.','Bounded sequences can still have convergent subsequences — that\'s Bolzano–Weierstrass.','Not yet — we need one more step.','Cauchy criterion isn\'t needed here.']},
        { question:'The sub-subsequence aₙₖⱼ → M. Why is this a contradiction?', options:['M ≠ L (since |aₙₖⱼ − L| ≥ ε₀) but aₙₖⱼ is a convergent subsequence of (aₙ) so M = L by hypothesis','M = L and ε₀ = 0','The sub-subsequence is not a subsequence of (aₙ)','There is no contradiction'],correct:0,
          explanations:['Correct! Since |aₙₖⱼ − L| ≥ ε₀ > 0 for all j, we get M ≠ L. But aₙₖⱼ is a convergent subsequence of (aₙ), so by hypothesis M = L. Contradiction! Therefore aₙ → L. ∎','If M = L then |aₙₖⱼ − L| → 0, contradicting |aₙₖⱼ − L| ≥ ε₀ > 0.','A sub-subsequence of a subsequence IS a subsequence of the original.','There is — M must equal L by hypothesis, but must not equal L by construction.']}
      ]
    }
  ]
},
{
  id:'series', num:3, title:'Infinite Series', subtitle:'Convergence tests and absolute convergence',
  defs:[
    { term:'Convergence of a Series', formal:'The series Σaₙ converges if the sequence of partial sums Sₙ = a₁ + a₂ + ... + aₙ converges. If Sₙ → S, we write Σaₙ = S.',
      intuition:'A series is really a sequence in disguise — the sequence of partial sums. So all our sequence tools apply. The tricky part: individual terms aₙ → 0 is NECESSARY but NOT SUFFICIENT for convergence (the harmonic series is the classic counterexample).',
      example:'Σ(1/2ⁿ) = 1/2 + 1/4 + 1/8 + ... Partial sums: 1/2, 3/4, 7/8, ... → 1. The series converges to 1.'
    },
    { term:'Absolute vs. Conditional Convergence', formal:'Σaₙ converges absolutely if Σ|aₙ| converges. It converges conditionally if Σaₙ converges but Σ|aₙ| diverges. Absolute convergence ⟹ convergence (but not vice versa).',
      intuition:'Absolute convergence means the series converges even if you "remove all cancellation" by taking absolute values. It\'s a stronger, more robust form of convergence. Conditionally convergent series are delicate — Riemann\'s rearrangement theorem says you can rearrange the terms to sum to ANY value.',
      example:'Σ(−1)ⁿ⁺¹/n = 1 − 1/2 + 1/3 − ... = ln 2 (conditionally convergent). Σ1/n diverges, so it\'s not absolute.'
    },
    { term:'Comparison Test', formal:'If 0 ≤ aₙ ≤ bₙ for all n: (1) if Σbₙ converges, then Σaₙ converges; (2) if Σaₙ diverges, then Σbₙ diverges.',
      intuition:'A smaller series inherits convergence from a larger one, and a larger series inherits divergence from a smaller one. Think of it as: if the big one fits, the small one fits; if the small one overflows, the big one overflows.',
      example:'Σ1/n² converges because 1/n² ≤ 1/n(n−1) = 1/(n−1) − 1/n (telescoping, converges to 1) for n ≥ 2.'
    },
    { term:'Ratio Test', formal:'For Σaₙ with aₙ ≠ 0, let r = lim|aₙ₊₁/aₙ|. If r < 1, the series converges absolutely. If r > 1, it diverges. If r = 1, the test is inconclusive.',
      intuition:'The ratio test compares your series to a geometric series. If consecutive terms shrink by a factor < 1, eventually the series looks geometric with ratio r < 1, which converges. If r > 1, terms grow, so divergence. At r = 1, you\'re at the boundary.',
      example:'Σ n/2ⁿ: ratio = (n+1)/2ⁿ⁺¹ · 2ⁿ/n = (n+1)/(2n) → 1/2 < 1. Converges.'
    }
  ],
  explained:[
    { id:'se1', difficulty:1, statement:'Determine whether Σₙ₌₁^∞ 1/n(n+1) converges, and find the sum if so.',
      steps:[
        {title:'Use partial fractions', content:'1/n(n+1) = 1/n − 1/(n+1). This is a telescoping decomposition.'},
        {title:'Write the partial sum', content:'Sₙ = (1 − 1/2) + (1/2 − 1/3) + ... + (1/n − 1/(n+1)) = 1 − 1/(n+1).'},
        {title:'Take the limit', content:'lim Sₙ = lim(1 − 1/(n+1)) = 1. So Σ 1/n(n+1) = 1. ∎'}
      ], answer:'Converges to 1'
    },
    { id:'se2', difficulty:2, statement:'Prove the harmonic series Σ 1/n diverges.',
      steps:[
        {title:'Group terms by powers of 2', content:'1 + 1/2 + (1/3 + 1/4) + (1/5 + 1/6 + 1/7 + 1/8) + ...'},
        {title:'Bound each group below', content:'The group from 1/(2ᵏ⁻¹+1) to 1/2ᵏ has 2ᵏ⁻¹ terms, each ≥ 1/2ᵏ. So each group sums to ≥ 2ᵏ⁻¹ · 1/2ᵏ = 1/2.'},
        {title:'Sum diverges', content:'The partial sums grow by at least 1/2 with each group, so Sₙ → ∞. ∎ This is Oresme\'s proof (c. 1350), one of the oldest divergence proofs.'}
      ], answer:'Diverges'
    },
    { id:'se3', difficulty:3, statement:'Prove Σₙ₌₁^∞ 1/n² converges using the comparison test.',
      steps:[
        {title:'Find a comparator', content:'For n ≥ 2: 1/n² ≤ 1/n(n−1) = 1/(n−1) − 1/n (partial fractions).'},
        {title:'The comparator telescopes', content:'Σₙ₌₂^N 1/n(n−1) = (1 − 1/2) + (1/2 − 1/3) + ... + (1/(N−1) − 1/N) = 1 − 1/N → 1.'},
        {title:'Apply comparison test', content:'Since 0 < 1/n² ≤ 1/n(n−1) for n ≥ 2 and Σ 1/n(n−1) converges, by comparison Σ 1/n² converges.'},
        {title:'Bound the sum', content:'Σₙ₌₁^∞ 1/n² = 1 + Σₙ₌₂^∞ 1/n² ≤ 1 + 1 = 2. (The exact value is π²/6 ≈ 1.645, proved by Euler.)'}
      ], answer:'Converges (to π²/6)'
    },
    { id:'se4', difficulty:4, statement:'Prove the alternating series test: if (aₙ) is decreasing with aₙ → 0 and aₙ ≥ 0, then Σ(−1)ⁿ⁺¹aₙ converges.',
      steps:[
        {title:'Look at even partial sums', content:'S₂ₙ = (a₁−a₂) + (a₃−a₄) + ... + (a₂ₙ₋₁−a₂ₙ). Each parenthesized pair ≥ 0 since aₖ is decreasing. So S₂ₙ is increasing.'},
        {title:'Show S₂ₙ is bounded', content:'S₂ₙ = a₁ − (a₂−a₃) − (a₄−a₅) − ... − a₂ₙ ≤ a₁. Each parenthesized pair is ≥ 0, so we subtract nonnegative terms from a₁.'},
        {title:'Apply MCT', content:'S₂ₙ is increasing and bounded above by a₁, so by the Monotone Convergence Theorem, S₂ₙ → S for some S.'},
        {title:'Handle odd partial sums', content:'S₂ₙ₊₁ = S₂ₙ + a₂ₙ₊₁ → S + 0 = S. Both subsequences converge to S, so Sₙ → S. ∎'}
      ], answer:'Σ(−1)ⁿ⁺¹aₙ converges (Leibniz criterion)'
    },
    { id:'se5', difficulty:5, statement:'Determine convergence of Σₙ₌₁^∞ nᵖ/n! for any fixed p > 0.',
      steps:[
        {title:'Apply the ratio test', content:'Let aₙ = nᵖ/n!. Then |aₙ₊₁/aₙ| = (n+1)ᵖ/((n+1)!) · n!/nᵖ = (n+1)ᵖ⁻¹ · (1/nᵖ) · nᵖ / ... Let\'s simplify carefully.'},
        {title:'Simplify the ratio', content:'aₙ₊₁/aₙ = ((n+1)ᵖ · n!) / ((n+1)! · nᵖ) = (n+1)ᵖ / ((n+1) · nᵖ) = ((n+1)/n)ᵖ / (n+1) = (1 + 1/n)ᵖ / (n+1).'},
        {title:'Take the limit', content:'(1 + 1/n)ᵖ → 1ᵖ = 1 and 1/(n+1) → 0. So the ratio → 0 < 1.'},
        {title:'Conclude', content:'By the ratio test with r = 0 < 1, the series converges absolutely for every fixed p > 0. ∎ This shows factorials dominate any polynomial — n! grows faster than nᵖ for any p.'}
      ], answer:'Converges for all p > 0'
    }
  ],
  practice:[
    { id:'sep1', difficulty:1, statement:'Determine whether Σₙ₌₁^∞ 3ⁿ/n! converges or diverges.',
      steps:[
        { question:'Which test is most appropriate here?', options:['Ratio test','Comparison with harmonic series','Integral test','Alternating series test'],correct:0,
          explanations:['Correct! The factorial in the denominator suggests the ratio test — ratios of consecutive factorials simplify nicely.','The harmonic series is too weak as a comparator for terms with factorials.','The integral test works for monotone terms, but ratio test is more natural here.','All terms are positive, so this isn\'t an alternating series.']},
        { question:'What is |aₙ₊₁/aₙ| simplified?', options:['3/(n+1)','3n/(n+1)','(n+1)/3','3ⁿ⁺¹/(n+1)!'],correct:0,
          explanations:['Correct! aₙ₊₁/aₙ = (3ⁿ⁺¹/(n+1)!) · (n!/3ⁿ) = 3/(n+1).','Multiply carefully: 3ⁿ⁺¹/3ⁿ = 3, and n!/(n+1)! = 1/(n+1).','That\'s the reciprocal of the correct ratio.','We need to divide aₙ₊₁ by aₙ, not just write aₙ₊₁.']},
        { question:'Since lim 3/(n+1) = 0 < 1, the series:', options:['Converges absolutely','Diverges','Test is inconclusive','Converges conditionally'],correct:0,
          explanations:['Correct! r = 0 < 1, so the ratio test gives absolute convergence. (In fact, Σ xⁿ/n! = eˣ, so our series equals e³.) ∎','The limit ratio is 0 < 1, which gives convergence.','The test is inconclusive only when r = 1. Here r = 0.','All terms are positive, so absolute and regular convergence coincide.']}
      ]
    },
    { id:'sep2', difficulty:3, statement:'Does Σₙ₌₂^∞ 1/(n·ln²n) converge or diverge?',
      steps:[
        { question:'Which test is best suited for this series?', options:['Integral test','Ratio test','Root test','Alternating series test'],correct:0,
          explanations:['Correct! f(x) = 1/(x·ln²x) is positive, continuous, and decreasing for x ≥ 2. The integral test applies and the integral is computable with substitution.','The ratio |aₙ₊₁/aₙ| → 1 for this type of series, so ratio test is inconclusive.','Same issue — the root test gives limit 1.','All terms are positive, not alternating.']},
        { question:'Evaluate ∫₂^∞ 1/(x·ln²x) dx using u = ln x.', options:['[−1/ln x]₂^∞ = 1/ln 2 (converges)','[ln(ln x)]₂^∞ = ∞ (diverges)','[1/(2ln²x)]₂^∞','Does not have an antiderivative'],correct:0,
          explanations:['Correct! u = ln x, du = dx/x. ∫1/(x·ln²x)dx = ∫u⁻²du = −1/u = −1/ln x. Evaluating: 0−(−1/ln2) = 1/ln2. Finite!','That would be ∫1/(x·ln x)dx, not ∫1/(x·ln²x)dx. The extra power of ln changes convergence.','Differentiate to check: d/dx[1/(2ln²x)] ≠ 1/(x·ln²x).','It does: substitution u = ln x transforms it to ∫u⁻²du.']},
        { question:'By the integral test, the series:', options:['Converges','Diverges','Inconclusive','Need more information'],correct:0,
          explanations:['Correct! Since ∫₂^∞ 1/(x·ln²x)dx = 1/ln2 < ∞, the integral test tells us Σ 1/(n·ln²n) converges. Compare: Σ 1/(n·ln n) DIVERGES (integral = ln(ln x) → ∞). The extra power of ln matters! ∎','The integral converges to 1/ln 2, so the series converges too.','The integral test gives a definitive answer when applicable.','We have all the information we need.']}
      ]
    },
    { id:'sep3', difficulty:5, statement:'Determine whether Σₙ₌₁^∞ (−1)ⁿ⁺¹ · n/(n² + 1) converges absolutely, conditionally, or diverges.',
      steps:[
        { question:'Test absolute convergence: does Σ n/(n²+1) converge?', options:['No — n/(n²+1) ~ 1/n and Σ1/n diverges (limit comparison)','Yes — n/(n²+1) < 1/n²','Yes — ratio test gives r < 1','Cannot determine'],correct:0,
          explanations:['Correct! lim [n/(n²+1)]/(1/n) = lim n²/(n²+1) = 1. Since Σ1/n diverges and the limit is positive and finite, Σn/(n²+1) also diverges by the limit comparison test.','n/(n²+1) < 1/n² is false: n/(n²+1) ≈ 1/n >> 1/n² for large n.','The ratio test gives limit 1 (inconclusive) for rational functions.','Limit comparison with 1/n settles it.']},
        { question:'Now test conditional convergence using the alternating series test. Is aₙ = n/(n²+1) decreasing for large n?', options:['Yes — check a\'(x) = (1−x²)/(x²+1)² < 0 for x > 1','No — it\'s increasing','It oscillates','Only for n ≥ 10'],correct:0,
          explanations:['Correct! f(x) = x/(x²+1) has f\'(x) = (x²+1−2x²)/(x²+1)² = (1−x²)/(x²+1)² < 0 for x > 1. So aₙ is decreasing for n ≥ 2.','The derivative is negative for x > 1.','The terms are strictly monotone (decreasing) for n ≥ 2.','Already decreasing from n = 2 onward.']},
        { question:'Since aₙ is decreasing for n ≥ 2 and aₙ → 0, the series:', options:['Converges conditionally','Converges absolutely','Diverges','Need more tests'],correct:0,
          explanations:['Correct! By the alternating series test (aₙ decreasing, aₙ → 0), the series converges. But Σ|aₙ| diverges (limit comparison with Σ1/n). So: conditionally convergent. ∎','We showed Σ|aₙ| diverges, so convergence is not absolute.','The alternating series test confirms convergence.','The alternating series test is sufficient.']}
      ]
    }
  ]
},
{
  id:'topology', num:4, title:'Topology of ℝ', subtitle:'Open sets, closed sets, compactness, and connectedness',
  defs:[
    { term:'Open and Closed Sets', formal:'A set U ⊆ ℝ is open if for every x ∈ U, there exists ε > 0 with (x−ε, x+ε) ⊆ U. A set F is closed if its complement ℝ\\F is open. Equivalently, F is closed iff it contains all its limit points.',
      intuition:'Open sets have "breathing room" around every point — no point is on the boundary. Closed sets "hold onto their boundaries." Neither property is the negation of the other: sets can be both (ℝ, ∅) or neither ((0,1]).',
      example:'(0,1) is open. [0,1] is closed. [0,1) is neither. ℝ and ∅ are both open and closed ("clopen").'
    },
    { term:'Limit Point', formal:'x is a limit point (accumulation point) of S if every neighborhood (x−ε, x+ε) contains a point of S different from x. Equivalently, there exists a sequence in S\\{x} converging to x.',
      intuition:'A limit point is a place where S "piles up." You can\'t isolate x from S — no matter how small a neighborhood you take, S always has other points there. The key: x doesn\'t need to be in S; it just needs to be "approached" by S.',
      example:'0 is a limit point of {1/n : n ∈ ℕ} even though 0 ∉ S. Every point of [0,1] is a limit point of (0,1).'
    },
    { term:'Compact Sets', formal:'K ⊆ ℝ is compact if every open cover of K has a finite subcover. Heine-Borel Theorem: K ⊆ ℝ is compact ⟺ K is closed and bounded.',
      intuition:'Compactness is the topological version of "finite." Compact sets behave like finite sets in many ways: continuous functions on them achieve their max/min, sequences in them have convergent subsequences, and you can always reduce infinite covers to finite ones.',
      example:'[0,1] is compact (closed and bounded). (0,1) is not compact (open cover {(1/n, 1) : n ≥ 1} has no finite subcover). ℕ is not compact (closed but unbounded).'
    },
    { term:'Connected Sets', formal:'S ⊆ ℝ is connected if it cannot be written as S = A ∪ B where A,B are nonempty, disjoint, and both open relative to S. In ℝ, connected sets are exactly the intervals.',
      intuition:'A connected set has no "gaps" — you can\'t split it into two separated pieces. In ℝ, this is equivalent to: if a,b ∈ S and a < c < b, then c ∈ S. The Intermediate Value Theorem is essentially a consequence of the continuous image of a connected set being connected.',
      example:'{0} ∪ {1} is disconnected. [0,1] is connected. ℚ is disconnected (split at √2).'
    }
  ],
  explained:[
    { id:'t1', difficulty:1, statement:'Prove that (a,b) is open for any a < b.',
      steps:[
        {title:'Take any x ∈ (a,b)', content:'We have a < x < b. We need to find ε > 0 with (x−ε, x+ε) ⊆ (a,b).'},
        {title:'Choose ε', content:'Let ε = min{x − a, b − x}. Both x − a > 0 and b − x > 0, so ε > 0.'},
        {title:'Verify containment', content:'For any y ∈ (x−ε, x+ε): y > x − ε ≥ x − (x−a) = a and y < x + ε ≤ x + (b−x) = b. So y ∈ (a,b). ∎'}
      ], answer:'(a,b) is open'
    },
    { id:'t2', difficulty:2, statement:'Prove that [a,b] is closed by showing its complement is open.',
      steps:[
        {title:'Identify the complement', content:'ℝ\\[a,b] = (−∞, a) ∪ (b, ∞). We need to show this is open.'},
        {title:'Each piece is open', content:'(−∞, a) is open: for x < a, take ε = a − x. (b, ∞) is open: for x > b, take ε = x − b.'},
        {title:'Union of open sets is open', content:'This is a theorem: any union of open sets is open (follows directly from the definition). Since (−∞,a) and (b,∞) are both open, their union is open. ∎'}
      ], answer:'[a,b] is closed'
    },
    { id:'t3', difficulty:3, statement:'Prove the Heine-Borel Theorem: every closed, bounded subset of ℝ is compact.',
      steps:[
        {title:'Setup', content:'Let K ⊆ [a,b] be closed. Let {Uα} be an open cover of K. We show it has a finite subcover.'},
        {title:'Define a "good" set', content:'Let S = {x ∈ [a,b] : K ∩ [a,x] can be covered by finitely many Uα}. Since a ∈ Uα₀ for some α₀, we have a ∈ S, so S ≠ ∅. Also S ⊆ [a,b], so S is bounded.'},
        {title:'Let c = sup S', content:'By completeness, c exists. Key claim: c = b and c ∈ S. Since K is closed and covered by open sets, c ∈ Uβ for some β. Since Uβ is open, there exists δ > 0 with (c−δ, c+δ) ⊆ Uβ.'},
        {title:'Finish', content:'By the ε-characterization of sup, ∃x₀ ∈ S with c − δ < x₀. Then K ∩ [a,x₀] has a finite subcover, and K ∩ [x₀,min(c+δ,b)] is covered by just Uβ. If c < b, then c + δ/2 ∈ S, contradicting c = sup S. So c = b and we have a finite subcover. ∎'}
      ], answer:'K is compact (Heine-Borel)'
    },
    { id:'t4', difficulty:4, statement:'Prove that a compact set K ⊆ ℝ is closed.',
      steps:[
        {title:'Show ℝ\\K is open', content:'Take x ∉ K. For each y ∈ K, choose disjoint open neighborhoods: Uᵧ of y and Vᵧ of x with Uᵧ ∩ Vᵧ = ∅ (possible since x ≠ y in a metric space).'},
        {title:'Cover K', content:'{Uᵧ : y ∈ K} is an open cover of K. By compactness, finitely many cover K: K ⊆ Uᵧ₁ ∪ ... ∪ Uᵧₙ.'},
        {title:'Intersect the neighborhoods of x', content:'Let V = Vᵧ₁ ∩ ... ∩ Vᵧₙ. This is a finite intersection of open sets, hence open. Also x ∈ V.'},
        {title:'V misses K', content:'If z ∈ V ∩ K, then z ∈ Uᵧᵢ for some i, so z ∈ Uᵧᵢ ∩ Vᵧᵢ = ∅, contradiction. So V ⊆ ℝ\\K. We found an open neighborhood of x in ℝ\\K, so ℝ\\K is open. ∎'}
      ], answer:'K is closed'
    },
    { id:'t5', difficulty:5, statement:'Prove: every sequence in a compact set K has a subsequence converging to a point in K.',
      steps:[
        {title:'Setup (sequential compactness)', content:'Let (xₙ) be a sequence in K. Since K is compact (hence bounded by Heine-Borel), (xₙ) is bounded.'},
        {title:'Extract a convergent subsequence', content:'By Bolzano-Weierstrass, (xₙ) has a subsequence xₙₖ → L for some L ∈ ℝ.'},
        {title:'Show L ∈ K', content:'Since K is compact, K is closed. Since xₙₖ ∈ K for all k and xₙₖ → L, and closed sets contain all limits of convergent sequences, we get L ∈ K. ∎'},
        {title:'Significance', content:'This is "sequential compactness" — equivalent to compactness in ℝ (and in all metric spaces). It\'s the key to proving extreme value theorem and uniform continuity on compact sets.'}
      ], answer:'K is sequentially compact'
    }
  ],
  practice:[
    { id:'tp1', difficulty:1, statement:'Is S = {1/n : n ∈ ℕ} closed? What are its limit points?',
      steps:[
        { question:'What are the limit points of S?', options:['Just 0','0 and all 1/n','No limit points','All points in [0,1]'],correct:0,
          explanations:['Correct! 0 is the only limit point: 1/n → 0, and every neighborhood of 0 contains points of S. Each 1/n is isolated — you can find ε > 0 with no other points of S within ε.','Each 1/n is an isolated point, not a limit point. Only 0 is a limit point.','0 is a limit point since 1/n → 0.','Most points in [0,1] have neighborhoods missing S entirely.']},
        { question:'Is S closed?', options:['No — 0 is a limit point but 0 ∉ S','Yes — all elements are in S','Yes — the complement is open','Cannot determine'],correct:0,
          explanations:['Correct! A closed set must contain all its limit points. 0 is a limit point of S but 0 ∉ S, so S is not closed.','Containing its own elements isn\'t enough. It must contain limit points too.','The complement contains 0, and 0 is a limit point of S, so... it\'s more subtle than that.','We can determine: it\'s not closed.']},
        { question:'Is S̄ = S ∪ {0} (the closure) compact?', options:['Yes — it is closed and bounded','No — it is not bounded','No — it is not closed','Need more information'],correct:0,
          explanations:['Correct! S̄ = {0} ∪ {1/n : n ∈ ℕ} ⊆ [0,1] is bounded. It is closed (it now contains its only limit point, 0). By Heine-Borel, it is compact. ∎','S̄ ⊆ [0,1], so it is bounded.','S̄ contains all its limit points, so it is closed.','Heine-Borel gives the answer.']}
      ]
    },
    { id:'tp2', difficulty:3, statement:'Prove that the intersection of two open sets is open.',
      steps:[
        { question:'Let U₁, U₂ be open and x ∈ U₁ ∩ U₂. What do we know?', options:['∃ε₁ > 0 with (x−ε₁,x+ε₁) ⊆ U₁ AND ∃ε₂ > 0 with (x−ε₂,x+ε₂) ⊆ U₂','∃ε > 0 with (x−ε,x+ε) ⊆ U₁ ∪ U₂','x is a limit point of both sets','U₁ = U₂'],correct:0,
          explanations:['Correct! Since each Uᵢ is open, we get individual neighborhoods. Now we need a single ε that works for both.','We need containment in U₁ ∩ U₂, not U₁ ∪ U₂.','Open sets contain neighborhoods, which is stronger than being limit points.','They need not be equal.']},
        { question:'How do you combine ε₁ and ε₂?', options:['Take ε = min{ε₁, ε₂}','Take ε = max{ε₁, ε₂}','Take ε = ε₁ + ε₂','Take ε = ε₁ · ε₂'],correct:0,
          explanations:['Correct! ε = min{ε₁,ε₂} > 0, and (x−ε,x+ε) ⊆ (x−ε₁,x+ε₁) ⊆ U₁ and (x−ε,x+ε) ⊆ (x−ε₂,x+ε₂) ⊆ U₂.','Max might exceed one of the neighborhoods.','Too large — might leave both neighborhoods.','This works but min is simpler and standard.']},
        { question:'Why doesn\'t this argument work for INFINITE intersections?', options:['inf{εᵢ} might be 0 — no positive ε guaranteed','It does work for infinite intersections','You can\'t take min of infinitely many numbers','Infinite intersections aren\'t well-defined'],correct:0,
          explanations:['Correct! Example: ∩ₙ(−1/n,1/n) = {0}, which is not open. Each (−1/n,1/n) is open, but the infimum of the ε values is 0. Finite intersections of open sets are open; infinite intersections need not be. ∎','Counterexample: ∩(−1/n,1/n) = {0}, not open.','You can take inf, but it might be 0.','They are well-defined as {x : x ∈ all Uₙ}.']}
      ]
    },
    { id:'tp3', difficulty:5, statement:'Prove: if K₁ ⊇ K₂ ⊇ K₃ ⊇ ... are nonempty compact sets, then ∩Kₙ ≠ ∅.',
      steps:[
        { question:'Choose xₙ ∈ Kₙ for each n. What can we say about the sequence (xₙ)?', options:['(xₙ) is bounded (all xₙ ∈ K₁ which is bounded)','(xₙ) converges','(xₙ) is Cauchy','Nothing — we need more info'],correct:0,
          explanations:['Correct! Since Kₙ ⊆ K₁ for all n, every xₙ lies in the compact (hence bounded) set K₁. So (xₙ) is bounded.','We don\'t know it converges yet — that requires Bolzano-Weierstrass.','Cauchy would imply convergence, which we haven\'t established.','Boundedness follows from K₁ being compact.']},
        { question:'By Bolzano-Weierstrass, (xₙ) has a convergent subsequence xₙₖ → L. Why is L ∈ Kₘ for every m?', options:['For k large enough, nₖ ≥ m so xₙₖ ∈ Kₘ. Since Kₘ is closed, L ∈ Kₘ','L must be in K₁ which contains everything','L is a limit point of ℝ','By the nested intervals theorem'],correct:0,
          explanations:['Correct! Fix m. For all k with nₖ ≥ m, xₙₖ ∈ Kₙₖ ⊆ Kₘ. So (xₙₖ)ₖ≥ₖ₀ is a sequence in Kₘ converging to L. Since Kₘ is compact (hence closed), L ∈ Kₘ.','We need L in every Kₘ, not just K₁.','Being a limit point of ℝ says nothing about membership in Kₘ.','Nested intervals need intervals specifically; this is more general.']},
        { question:'Since L ∈ Kₘ for all m, we conclude:', options:['L ∈ ∩Kₙ, so ∩Kₙ ≠ ∅ (Cantor\'s intersection theorem)','∩Kₙ = {L}','∩Kₙ is compact','The intersection is countable'],correct:0,
          explanations:['Correct! L ∈ ∩ₙKₙ, proving the intersection is nonempty. This is Cantor\'s Intersection Theorem. Note: compactness is essential — nested closed but unbounded sets like [n,∞) have empty intersection. ∎','The intersection might contain more than just L.','True (intersection of compact sets is compact) but the question asks about nonemptiness.','We only proved nonemptiness, not countability.']}
      ]
    }
  ]
},
{
  id:'continuity', num:5, title:'Limits & Continuity', subtitle:'The ε-δ definition and its consequences',
  defs:[
    { term:'ε-δ Continuity', formal:'f is continuous at c if for every ε > 0, there exists δ > 0 such that |x − c| < δ ⟹ |f(x) − f(c)| < ε. f is continuous on S if it is continuous at every point of S.',
      intuition:'Small changes in input produce small changes in output. YOU challenge me with ε (how close you want f(x) to f(c)), and I respond with δ (how close x needs to be to c). If I can always find a δ, f is continuous. The δ can depend on both ε AND c.',
      example:'f(x) = x² is continuous at c = 3: given ε, if |x−3| < δ = min{1, ε/7}, then |x²−9| = |x+3||x−3| < 7δ ≤ ε.'
    },
    { term:'Uniform Continuity', formal:'f is uniformly continuous on S if for every ε > 0, there exists δ > 0 such that for ALL x,y ∈ S, |x − y| < δ ⟹ |f(x) − f(y)| < ε.',
      intuition:'The key difference from pointwise continuity: ONE δ works for ALL points simultaneously. For regular continuity, δ can depend on the point c. Uniformly continuous means the function doesn\'t get "steeper and steeper" anywhere — it has a uniform rate of change control.',
      example:'f(x) = x² on [0,1] is uniformly continuous (compact domain). f(x) = x² on ℝ is NOT uniformly continuous (gets arbitrarily steep). f(x) = 1/x on (0,1) is not uniformly continuous.'
    },
    { term:'Intermediate Value Theorem', formal:'If f is continuous on [a,b] and f(a) < v < f(b) (or f(b) < v < f(a)), then there exists c ∈ (a,b) with f(c) = v.',
      intuition:'A continuous function on an interval can\'t "skip" values — if it starts at f(a) and ends at f(b), it must pass through every value in between. This is because continuous images of connected sets are connected, and connected subsets of ℝ are intervals.',
      example:'f(x) = x² − 2 is continuous, f(1) = −1 < 0 < 2 = f(2). So ∃c ∈ (1,2) with c² = 2, i.e., c = √2. IVT proves √2 exists!'
    },
    { term:'Extreme Value Theorem', formal:'If f is continuous on a compact set K, then f attains its maximum and minimum: ∃x*, x₊ ∈ K with f(x*) ≤ f(x) ≤ f(x₊) for all x ∈ K.',
      intuition:'Continuous functions on compact sets are "well-behaved" — they can\'t escape to infinity and they can\'t approach a value without reaching it. The proof combines compactness (bounded image has a sup) with sequential compactness (a maximizing sequence has a convergent subsequence whose limit is in K).',
      example:'f(x) = x(1−x) on [0,1] achieves max 1/4 at x = 1/2 and min 0 at x = 0 and x = 1. On (0,1), the min 0 is not achieved.'
    }
  ],
  explained:[
    { id:'c1', difficulty:1, statement:'Prove f(x) = 3x + 1 is continuous at every c ∈ ℝ using ε-δ.',
      steps:[
        {title:'Set up', content:'Let ε > 0 and c ∈ ℝ. We need δ > 0 with |x − c| < δ ⟹ |f(x) − f(c)| < ε.'},
        {title:'Compute |f(x) − f(c)|', content:'|f(x) − f(c)| = |(3x+1) − (3c+1)| = |3x − 3c| = 3|x − c|.'},
        {title:'Choose δ', content:'Set δ = ε/3. Then |x−c| < δ ⟹ |f(x)−f(c)| = 3|x−c| < 3·(ε/3) = ε. ∎ Note: δ depends only on ε, not on c, so f is also uniformly continuous.'}
      ], answer:'f(x) = 3x+1 is continuous everywhere'
    },
    { id:'c2', difficulty:2, statement:'Prove f(x) = x² is continuous at c = 2.',
      steps:[
        {title:'Compute |f(x) − f(c)|', content:'|x² − 4| = |x − 2||x + 2|. We control |x − 2| with δ, but need to bound |x + 2|.'},
        {title:'Bound |x + 2|', content:'If |x − 2| < 1 (i.e., 1 < x < 3), then |x + 2| < 5. So restrict δ ≤ 1 first.'},
        {title:'Choose δ and verify', content:'Let δ = min{1, ε/5}. Then |x−2| < δ ⟹ |x²−4| = |x−2||x+2| < δ·5 ≤ (ε/5)·5 = ε. ∎'},
        {title:'The min{1, ...} trick', content:'This is a standard technique: first restrict to a neighborhood (δ ≤ 1) to bound the "bad" factor, then choose δ small enough for the overall bound. You\'ll use this pattern repeatedly.'}
      ], answer:'x² is continuous at c = 2'
    },
    { id:'c3', difficulty:3, statement:'Prove: if f is continuous on [a,b], then f is bounded on [a,b].',
      steps:[
        {title:'Proof by contradiction', content:'Suppose f is unbounded. Then for each n ∈ ℕ, ∃xₙ ∈ [a,b] with |f(xₙ)| > n.'},
        {title:'Extract a convergent subsequence', content:'(xₙ) is a sequence in [a,b], which is compact. By Bolzano-Weierstrass, ∃xₙₖ → c ∈ [a,b].'},
        {title:'Apply continuity', content:'Since f is continuous at c, f(xₙₖ) → f(c). Convergent sequences are bounded, so ∃M with |f(xₙₖ)| ≤ M for all k.'},
        {title:'Contradiction', content:'But |f(xₙₖ)| > nₖ → ∞, which contradicts boundedness. So f must be bounded on [a,b]. ∎ This is the first step in proving the Extreme Value Theorem.'}
      ], answer:'f is bounded on [a,b]'
    },
    { id:'c4', difficulty:4, statement:'Prove: if f is continuous on a compact set K, then f is uniformly continuous on K.',
      steps:[
        {title:'Assume not (for contradiction)', content:'Suppose f is not uniformly continuous. Then ∃ε₀ > 0 such that for every δ = 1/n, ∃xₙ, yₙ ∈ K with |xₙ − yₙ| < 1/n but |f(xₙ) − f(yₙ)| ≥ ε₀.'},
        {title:'Extract convergent subsequence', content:'(xₙ) is in compact K, so ∃xₙₖ → c ∈ K. Since |xₙₖ − yₙₖ| < 1/nₖ → 0, also yₙₖ → c.'},
        {title:'Apply continuity at c', content:'f is continuous at c, so f(xₙₖ) → f(c) and f(yₙₖ) → f(c). Therefore |f(xₙₖ) − f(yₙₖ)| → 0.'},
        {title:'Contradiction', content:'But |f(xₙₖ) − f(yₙₖ)| ≥ ε₀ > 0 for all k, contradicting convergence to 0. ∎ This proof beautifully combines compactness + continuity + sequences.'}
      ], answer:'Continuous on compact ⟹ uniformly continuous'
    },
    { id:'c5', difficulty:5, statement:'Prove the Intermediate Value Theorem: if f is continuous on [a,b] with f(a) < 0 < f(b), then ∃c ∈ (a,b) with f(c) = 0.',
      steps:[
        {title:'Define the candidate via sup', content:'Let S = {x ∈ [a,b] : f(x) < 0}. S is nonempty (a ∈ S) and bounded above by b. Let c = sup S.'},
        {title:'Show f(c) ≥ 0', content:'If f(c) < 0, by continuity ∃δ with f(x) < 0 for all x ∈ (c−δ, c+δ). Then c + δ/2 ∈ S, contradicting c = sup S. So f(c) ≥ 0.'},
        {title:'Show f(c) ≤ 0', content:'If f(c) > 0, by continuity ∃δ with f(x) > 0 for all x ∈ (c−δ, c+δ). So no point of (c−δ, c) is in S, meaning c − δ is an upper bound of S, contradicting c = sup S. So f(c) ≤ 0.'},
        {title:'Combine', content:'f(c) ≥ 0 and f(c) ≤ 0 gives f(c) = 0. Also c ∈ (a,b) since f(a) < 0 and f(b) > 0. ∎ This proof is purely topological — it uses completeness (sup exists) and continuity, nothing else.'}
      ], answer:'∃c with f(c) = 0 (IVT)'
    }
  ],
  practice:[
    { id:'cp1', difficulty:1, statement:'Show that f(x) = 1/x is not uniformly continuous on (0,1).',
      steps:[
        { question:'What does it mean for f to NOT be uniformly continuous?', options:['∃ε₀>0 such that ∀δ>0, ∃x,y with |x−y|<δ but |f(x)−f(y)|≥ε₀','∀ε>0, ∀δ>0, ∃x,y with |x−y|<δ but |f(x)−f(y)|≥ε','f is discontinuous at some point','f is unbounded'],correct:0,
          explanations:['Correct! The negation of uniform continuity has a FIXED ε₀ (existential), then for ALL δ we find a bad pair.','The ε₀ is existential (fixed), not universal.','f(x)=1/x is continuous on (0,1). Uniform continuity is different from continuity.','Unboundedness alone doesn\'t prevent uniform continuity (though it helps).']},
        { question:'Take ε₀=1. For any δ>0, what pair x,y works?', options:['x = δ/(δ+1), y = δ/(2δ+1) — but simpler: x = 1/n, y = 1/(n+1) for large n','x = δ, y = 2δ','x = 1/2, y = 1/2 + δ','Any pair in (0,δ)'],correct:0,
          explanations:['Correct! Take x=1/n, y=1/(n+1). Then |x−y| = 1/(n(n+1)) → 0, but |1/x−1/y| = |n−(n+1)| = 1 ≥ ε₀ = 1. For any δ, choose n large enough so 1/(n(n+1)) < δ.','|1/δ − 1/(2δ)| = 1/(2δ) which depends on δ, not fixed ≥ ε₀.','For fixed y near 1/2, |f(x)−f(y)| can be small.','Need a specific pair, not "any pair."']},
        { question:'With xₙ=1/n, yₙ=1/(n+1): |xₙ−yₙ| = 1/(n(n+1)) → 0 but |f(xₙ)−f(yₙ)| = 1 ≥ 1. This proves:', options:['f is not uniformly continuous on (0,1)','f is not continuous on (0,1)','f is uniformly continuous on (0,1)','Nothing — we need more'],correct:0,
          explanations:['Correct! We found ε₀=1 such that for every δ>0, there exist x,y ∈ (0,1) with |x−y|<δ but |f(x)−f(y)|≥1. This is the negation of uniform continuity. ∎','f IS continuous on (0,1) — each individual point has its own δ.','We just proved the opposite.','This is a complete proof by the definition of "not uniformly continuous."']}
      ]
    },
    { id:'cp2', difficulty:3, statement:'Use IVT to prove that every odd-degree polynomial has a real root.',
      steps:[
        { question:'Let p(x) = xⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₀ with n odd. What is the behavior as x → ±∞?', options:['p(x) → +∞ as x → +∞ and p(x) → −∞ as x → −∞','p(x) → +∞ in both directions','p(x) → −∞ in both directions','Depends on the coefficients'],correct:0,
          explanations:['Correct! The leading term xⁿ dominates: since n is odd, xⁿ → +∞ as x → +∞ and xⁿ → −∞ as x → −∞.','That\'s the case for even degree. Odd degree has opposite signs at ±∞.','Only if leading coefficient were negative.','With leading coefficient 1 and odd degree, the signs are determined.']},
        { question:'Since p is continuous and changes sign, what does IVT give us?', options:['∃c ∈ ℝ with p(c) = 0','p has exactly one root','p has n roots','p has no real roots'],correct:0,
          explanations:['Correct! ∃M>0 with p(M)>0 and p(−M)<0. Since p is continuous on [−M,M] and changes sign, IVT gives c ∈ (−M,M) with p(c)=0.','IVT guarantees at least one root, not exactly one. x³−x has three.','IVT gives at least one real root; the total count requires more.','We just showed it must have one.']},
        { question:'Why does this argument fail for even-degree polynomials?', options:['Even-degree polynomials go to +∞ in both directions, so they might not change sign','IVT doesn\'t apply to even-degree polynomials','Even-degree polynomials aren\'t continuous','The leading coefficient matters more'],correct:0,
          explanations:['Correct! x² + 1 > 0 for all x — it never changes sign, so IVT can\'t produce a root. Even-degree polynomials CAN have roots (x²−1), but aren\'t guaranteed to. ∎','IVT applies to any continuous function. The issue is whether it changes sign.','All polynomials are continuous.','The leading coefficient is positive; the issue is the direction at ±∞.']}
      ]
    },
    { id:'cp3', difficulty:5, statement:'Prove: if f: [0,1] → [0,1] is continuous, then f has a fixed point (∃c with f(c) = c).',
      steps:[
        { question:'Define g(x) = f(x) − x. What are g(0) and g(1)?', options:['g(0) = f(0) ≥ 0 and g(1) = f(1) − 1 ≤ 0','g(0) = 0 and g(1) = 0','g(0) < 0 and g(1) > 0','Cannot determine without knowing f'],correct:0,
          explanations:['Correct! Since f: [0,1]→[0,1], f(0) ∈ [0,1] so g(0) = f(0) − 0 = f(0) ≥ 0. And f(1) ∈ [0,1] so g(1) = f(1) − 1 ≤ 0.','g(0)=0 would mean f(0)=0, which isn\'t guaranteed.','g(0) = f(0) ≥ 0 since f(0) ∈ [0,1].','We CAN determine the signs using f: [0,1]→[0,1].']},
        { question:'If g(0) = 0 or g(1) = 0, we\'re done. Otherwise, g(0) > 0 and g(1) < 0. What theorem applies?', options:['IVT: g is continuous and changes sign, so ∃c with g(c) = 0','Extreme Value Theorem','Bolzano-Weierstrass','Mean Value Theorem'],correct:0,
          explanations:['Correct! g is continuous on [0,1] (difference of continuous functions), g(0)>0>g(1), so by IVT ∃c ∈ (0,1) with g(c) = 0.','EVT gives max/min, not zeros.','B-W is about sequences, not functions directly.','MVT requires differentiability, which we don\'t have.']},
        { question:'g(c) = 0 means f(c) − c = 0, i.e., f(c) = c. This proves:', options:['f has a fixed point (Brouwer\'s fixed point theorem in 1D)','f is constant','f is the identity','f has exactly one fixed point'],correct:0,
          explanations:['Correct! This is the 1D Brouwer Fixed Point Theorem: every continuous map from [0,1] to itself has a fixed point. The higher-dimensional generalization (any continuous f: Bⁿ→Bⁿ has a fixed point) is much harder to prove. ∎','f need not be constant — it just has one point where f(c)=c.','f equals the identity only at c, not everywhere.','There could be multiple fixed points (e.g., f(x)=x has all points fixed).']}
      ]
    }
  ]
},
{
  id:'differentiation', num:6, title:'Differentiation', subtitle:'The derivative, Mean Value Theorem, and Taylor\'s theorem',
  defs:[
    { term:'The Derivative', formal:'f is differentiable at c if the limit f\'(c) = lim_{x→c} (f(x)−f(c))/(x−c) = lim_{h→0} (f(c+h)−f(c))/h exists.',
      intuition:'The derivative measures the instantaneous rate of change — the slope of the tangent line. Differentiability is STRONGER than continuity: differentiable ⟹ continuous, but not vice versa (|x| is continuous but not differentiable at 0). Differentiability means the function is "locally linear" — it looks like a straight line when you zoom in.',
      example:'f(x) = x³: f\'(c) = lim (x³−c³)/(x−c) = lim(x²+xc+c²) = 3c². f(x) = |x|: not differentiable at 0 since left limit = −1, right limit = +1.'
    },
    { term:'Mean Value Theorem', formal:'If f is continuous on [a,b] and differentiable on (a,b), then ∃c ∈ (a,b) with f\'(c) = (f(b)−f(a))/(b−a).',
      intuition:'The average rate of change over [a,b] equals the instantaneous rate at some interior point. Geometrically: there\'s a point where the tangent line is parallel to the secant line. This is the most important theorem in differential calculus — it connects the local (derivative) to the global (function values).',
      example:'f(x) = x² on [1,3]: f\'(c) = 2c = (9−1)/(3−1) = 4, so c = 2 ∈ (1,3).'
    },
    { term:'Rolle\'s Theorem', formal:'If f is continuous on [a,b], differentiable on (a,b), and f(a) = f(b), then ∃c ∈ (a,b) with f\'(c) = 0.',
      intuition:'If a function starts and ends at the same value, it must "turn around" somewhere in between, and at that turning point, the derivative is zero. Rolle\'s theorem is a special case of MVT (with slope 0), but MVT is usually proved USING Rolle.',
      example:'f(x) = x² − x on [0,1]: f(0) = 0 = f(1). f\'(x) = 2x − 1 = 0 at c = 1/2.'
    },
    { term:'Taylor\'s Theorem', formal:'If f is n+1 times differentiable on an interval containing c, then f(x) = Σₖ₌₀ⁿ f⁽ᵏ⁾(c)/k! · (x−c)ᵏ + Rₙ(x) where the remainder Rₙ(x) = f⁽ⁿ⁺¹⁾(ξ)/(n+1)! · (x−c)ⁿ⁺¹ for some ξ between c and x.',
      intuition:'Taylor\'s theorem says any smooth function is "approximately polynomial" near a point. The more derivatives you use, the better the approximation. The remainder term Rₙ tells you exactly how good the approximation is. If Rₙ → 0 as n → ∞, the Taylor series converges to f.',
      example:'eˣ = 1 + x + x²/2! + x³/3! + ... + xⁿ/n! + Rₙ where |Rₙ| ≤ eˡˣˡ·|x|ⁿ⁺¹/(n+1)! → 0.'
    }
  ],
  explained:[
    { id:'d1', difficulty:1, statement:'Prove from the definition that f(x) = x² has f\'(c) = 2c.',
      steps:[
        {title:'Write the difference quotient', content:'(f(x) − f(c))/(x − c) = (x² − c²)/(x − c) = (x−c)(x+c)/(x−c) = x + c for x ≠ c.'},
        {title:'Take the limit', content:'f\'(c) = lim_{x→c}(x + c) = c + c = 2c. ∎'}
      ], answer:'f\'(c) = 2c'
    },
    { id:'d2', difficulty:2, statement:'Prove that if f is differentiable at c, then f is continuous at c.',
      steps:[
        {title:'Express f(x) − f(c)', content:'f(x) − f(c) = [(f(x)−f(c))/(x−c)] · (x − c) for x ≠ c.'},
        {title:'Take the limit', content:'lim_{x→c} [f(x) − f(c)] = lim_{x→c} [(f(x)−f(c))/(x−c)] · lim_{x→c}(x−c) = f\'(c) · 0 = 0.'},
        {title:'Conclude', content:'lim_{x→c} f(x) = f(c), so f is continuous at c. ∎ The converse is false: |x| is continuous at 0 but not differentiable.'}
      ], answer:'Differentiable ⟹ continuous'
    },
    { id:'d3', difficulty:3, statement:'Prove the Mean Value Theorem assuming Rolle\'s Theorem.',
      steps:[
        {title:'Define the auxiliary function', content:'Let g(x) = f(x) − [(f(b)−f(a))/(b−a)] · (x − a). This subtracts the secant line from f.'},
        {title:'Check Rolle\'s hypotheses', content:'g is continuous on [a,b] (diff of continuous functions) and differentiable on (a,b). g(a) = f(a) − 0 = f(a). g(b) = f(b) − (f(b)−f(a)) = f(a). So g(a) = g(b).'},
        {title:'Apply Rolle\'s theorem', content:'∃c ∈ (a,b) with g\'(c) = 0. That is, f\'(c) − (f(b)−f(a))/(b−a) = 0, so f\'(c) = (f(b)−f(a))/(b−a). ∎'},
        {title:'Key applications', content:'If f\'(x) = 0 on (a,b), then f is constant (apply MVT to any subinterval). If f\'(x) > 0, then f is increasing. MVT is the engine behind most of differential calculus.'}
      ], answer:'∃c with f\'(c) = (f(b)−f(a))/(b−a)'
    },
    { id:'d4', difficulty:4, statement:'Prove: if f\'(x) ≥ 0 on (a,b) and f is continuous on [a,b], then f is non-decreasing.',
      steps:[
        {title:'Take any x₁ < x₂ in [a,b]', content:'We need to show f(x₁) ≤ f(x₂).'},
        {title:'Apply MVT to [x₁, x₂]', content:'f is continuous on [x₁,x₂] and differentiable on (x₁,x₂), so ∃c ∈ (x₁,x₂) with f(x₂) − f(x₁) = f\'(c)(x₂ − x₁).'},
        {title:'Use the sign condition', content:'f\'(c) ≥ 0 (by hypothesis) and x₂ − x₁ > 0. So f(x₂) − f(x₁) = f\'(c)(x₂ − x₁) ≥ 0, meaning f(x₁) ≤ f(x₂). ∎'},
        {title:'Strict version', content:'If f\'(x) > 0 on (a,b), then f is strictly increasing. And if f\' ≡ 0 on (a,b), then f is constant — this seemingly obvious fact REQUIRES the MVT to prove rigorously.'}
      ], answer:'f\'≥ 0 ⟹ f non-decreasing'
    },
    { id:'d5', difficulty:5, statement:'Prove: if f is differentiable on (a,b), then f\' has the intermediate value property (Darboux\'s theorem).',
      steps:[
        {title:'Setup', content:'Suppose f\'(a₀) < λ < f\'(b₀) for a₀,b₀ ∈ (a,b) with a₀ < b₀. Define g(x) = f(x) − λx.'},
        {title:'Properties of g', content:'g\'(x) = f\'(x) − λ. So g\'(a₀) = f\'(a₀) − λ < 0 and g\'(b₀) = f\'(b₀) − λ > 0.'},
        {title:'Apply EVT', content:'g is continuous on [a₀,b₀], so it attains its minimum at some c ∈ [a₀,b₀]. Since g\'(a₀) < 0, g is decreasing at a₀, so c ≠ a₀. Since g\'(b₀) > 0, g is increasing at b₀, so c ≠ b₀. Thus c ∈ (a₀,b₀).'},
        {title:'At the interior minimum', content:'Since c is an interior minimum and f is differentiable, g\'(c) = 0, so f\'(c) = λ. ∎ This is remarkable: f\' has IVP even though f\' need not be continuous! No discontinuous function can be a derivative.'}
      ], answer:'f\' satisfies IVP (Darboux\'s theorem)'
    }
  ],
  practice:[
    { id:'dp1', difficulty:1, statement:'Use MVT to show that |sin x − sin y| ≤ |x − y| for all x, y.',
      steps:[
        { question:'Apply MVT to f(t) = sin t on [x,y] (WLOG x < y). What do you get?', options:['sin y − sin x = cos(c)(y − x) for some c between x and y','sin y − sin x = sin(c)(y − x)','sin y − sin x = (y − x)/2','MVT doesn\'t apply to sin'],correct:0,
          explanations:['Correct! sin is continuous and differentiable everywhere, so MVT gives sin y − sin x = cos(c) · (y − x) for some c ∈ (x,y).','The derivative of sin is cos, not sin.','MVT gives f\'(c), not 1/2.','Sin is differentiable everywhere, so MVT applies.']},
        { question:'How do you get from |sin y − sin x| = |cos c| · |y − x| to the result?', options:['|cos c| ≤ 1 for all c, so |sin y − sin x| ≤ |y − x|','|cos c| = 1 always','cos c > 0 always','Need triangle inequality'],correct:0,
          explanations:['Correct! |cos c| ≤ 1, so |sin y − sin x| = |cos c| · |y − x| ≤ 1 · |y − x| = |y − x|. ∎ This shows sin is Lipschitz with constant 1.','|cos c| ≤ 1, with equality only at c = nπ.','cos can be negative.','The key is |cos| ≤ 1, not triangle inequality.']},
        { question:'This result (|f(x)−f(y)| ≤ L|x−y|) is called:', options:['Lipschitz continuity (with constant L=1)','Uniform continuity','Hölder continuity','Differentiability'],correct:0,
          explanations:['Correct! f is Lipschitz with constant L if |f(x)−f(y)| ≤ L|x−y|. Lipschitz ⟹ uniformly continuous ⟹ continuous, but not vice versa. ∎','Lipschitz is a special (stronger) case of uniform continuity.','Hölder has |x−y|ᵅ for 0<α<1.','This is a consequence of differentiability + bounded derivative.']}
      ]
    },
    { id:'dp2', difficulty:3, statement:'Show that the equation x³ + x − 1 = 0 has exactly one real root.',
      steps:[
        { question:'First, show existence. f(0) = −1, f(1) = 1. What theorem gives a root?', options:['IVT: f is continuous and changes sign','MVT','Rolle\'s theorem','Bolzano-Weierstrass'],correct:0,
          explanations:['Correct! f(0) = −1 < 0 < 1 = f(1), and f is continuous, so by IVT ∃c ∈ (0,1) with f(c) = 0.','MVT gives derivative information, not zeros of f.','Rolle\'s requires f(a)=f(b), which we don\'t have.','B-W is about sequences.']},
        { question:'Now show uniqueness. What is f\'(x)?', options:['3x² + 1 > 0 for all x','3x² + 1 which could be zero','3x² which is ≥ 0','3x + 1'],correct:0,
          explanations:['Correct! f\'(x) = 3x² + 1 ≥ 1 > 0 for all x. So f is strictly increasing.','3x² + 1 ≥ 0 + 1 = 1 > 0 for all real x.','The derivative of x³+x−1 is 3x²+1, not 3x².','d/dx(x³) = 3x², not 3x.']},
        { question:'Since f\'(x) > 0 for all x, f is strictly increasing. Why does this give uniqueness?', options:['A strictly increasing function is injective: f(x₁) = f(x₂) ⟹ x₁ = x₂','Strictly increasing functions have no zeros','f\' > 0 means f > 0','MVT says so'],correct:0,
          explanations:['Correct! If f(c₁) = 0 = f(c₂) with c₁ ≠ c₂, then f(c₁) = f(c₂) but c₁ ≠ c₂, contradicting injectivity. So there\'s exactly one root. ∎','We showed f(0)<0 and f(1)>0, so a zero exists.','f\' > 0 means f is increasing, not that f > 0.','MVT proves f is increasing when f\'>0, which gives injectivity.']}
      ]
    },
    { id:'dp3', difficulty:5, statement:'Prove L\'Hôpital\'s Rule: if f(a) = g(a) = 0, f and g are differentiable near a, g\'(x) ≠ 0 near a, and lim f\'(x)/g\'(x) = L, then lim f(x)/g(x) = L.',
      steps:[
        { question:'Apply Cauchy\'s Mean Value Theorem to f,g on [a,x]: what do you get?', options:['f(x)/g(x) = f\'(c)/g\'(c) for some c between a and x (using f(a)=g(a)=0)','f(x)/g(x) = f\'(a)/g\'(a)','f(x)g\'(c) = g(x)f\'(c)','f\'(x)/g\'(x) = f(x)/g(x)'],correct:0,
          explanations:['Correct! Cauchy MVT: (f(x)−f(a))/(g(x)−g(a)) = f\'(c)/g\'(c). Since f(a)=g(a)=0, this gives f(x)/g(x) = f\'(c)/g\'(c) for some c ∈ (a,x).','That would be the limit as x→a, not the exact equality.','This is equivalent to option A: f(x)/g(x) = f\'(c)/g\'(c).','That\'s what we\'re trying to prove, not something we can assume.']},
        { question:'As x → a, what happens to c (which is between a and x)?', options:['c → a as well (squeezed between a and x)','c stays fixed','c → ∞','Cannot determine'],correct:0,
          explanations:['Correct! Since a < c < x (or x < c < a), as x → a we get c → a by the squeeze theorem.','c depends on x and is between a and x, so it must approach a.','c is between a and x, so it stays in a bounded region.','The squeeze principle determines this.']},
        { question:'Since f(x)/g(x) = f\'(c)/g\'(c) and c → a, and lim_{t→a} f\'(t)/g\'(t) = L:', options:['lim f(x)/g(x) = lim f\'(c)/g\'(c) = L ∎','We need an additional step','The proof is circular','L\'Hôpital doesn\'t apply here'],correct:0,
          explanations:['Correct! As x→a, c→a, so f\'(c)/g\'(c) → L. Therefore f(x)/g(x) = f\'(c)/g\'(c) → L. ∎ The Cauchy MVT does the heavy lifting, converting the 0/0 form into a ratio of derivatives.','The Cauchy MVT and squeeze on c complete the argument.','The proof uses Cauchy MVT, not L\'Hôpital itself.','We\'re proving L\'Hôpital, not applying it.']}
      ]
    }
  ]
},
{
  id:'integration', num:7, title:'Riemann Integration', subtitle:'Partitions, upper and lower sums, and the Fundamental Theorem',
  defs:[
    { term:'Partition and Riemann Sums', formal:'A partition P of [a,b] is a finite set {x₀=a < x₁ < ... < xₙ=b}. The upper sum U(f,P) = Σ Mᵢ·Δxᵢ and lower sum L(f,P) = Σ mᵢ·Δxᵢ where Mᵢ = sup f on [xᵢ₋₁,xᵢ] and mᵢ = inf f on [xᵢ₋₁,xᵢ].',
      intuition:'Cut the interval into pieces. On each piece, the function lies between its min (mᵢ) and max (Mᵢ). The lower sum uses all the mins (underestimate), the upper sum uses all the maxes (overestimate). The true "area" is trapped between them.',
      example:'f(x)=x on [0,1], P={0,1/2,1}: L = 0·(1/2) + (1/2)·(1/2) = 1/4. U = (1/2)·(1/2) + 1·(1/2) = 3/4.'
    },
    { term:'Riemann Integrability', formal:'f is Riemann integrable on [a,b] if sup_P L(f,P) = inf_P U(f,P). This common value is ∫ₐᵇ f. Equivalently, for every ε>0, ∃P with U(f,P) − L(f,P) < ε.',
      intuition:'The upper and lower sums can be squeezed arbitrarily close. The ε-criterion is the practical tool: find a single partition whose upper and lower sums differ by less than ε. Continuous functions on [a,b] are always integrable (use uniform continuity to control the gap).',
      example:'f(x) = x on [0,1]: L = (n−1)/(2n), U = (n+1)/(2n) with uniform partition. U−L = 1/n → 0. So ∫₀¹ x dx = 1/2.'
    },
    { term:'Fundamental Theorem of Calculus (FTC)', formal:'Part I: If f is integrable on [a,b] and F(x) = ∫ₐˣ f(t)dt, then F is continuous. If f is continuous at c, then F\'(c) = f(c). Part II: If f is continuous and F\' = f, then ∫ₐᵇ f = F(b)−F(a).',
      intuition:'Integration and differentiation are inverse operations. Part I says "the derivative of the integral is the original function." Part II says "the integral of the derivative gives back the function values." Together they bridge the two central concepts of calculus.',
      example:'f(x) = x². F(x) = ∫₀ˣ t² dt = x³/3. F\'(x) = x² = f(x) (Part I). ∫₀² x² dx = [x³/3]₀² = 8/3 (Part II).'
    },
    { term:'Integrability of Monotone and Continuous Functions', formal:'Every monotone function on [a,b] is Riemann integrable. Every continuous function on [a,b] is Riemann integrable.',
      intuition:'For monotone f: on each subinterval, Mᵢ − mᵢ = f(xᵢ) − f(xᵢ₋₁) (for increasing f). The total U − L telescopes to [f(b)−f(a)]·max Δxᵢ → 0. For continuous f: uniform continuity gives Mᵢ − mᵢ < ε/(b−a) for fine enough partition, so U − L < ε.',
      example:'The Dirichlet function (1 on ℚ, 0 on irrationals) is NOT Riemann integrable: L = 0 and U = 1 for every partition.'
    }
  ],
  explained:[
    { id:'i1', difficulty:1, statement:'Compute ∫₀¹ x dx from the definition using uniform partitions.',
      steps:[
        {title:'Set up the partition', content:'Pₙ = {0, 1/n, 2/n, ..., 1}. Each subinterval has width Δx = 1/n. On [i−1/n, i/n], for f(x)=x: mᵢ = (i−1)/n, Mᵢ = i/n.'},
        {title:'Compute L(f,Pₙ)', content:'L = Σᵢ₌₁ⁿ (i−1)/n · (1/n) = (1/n²) Σᵢ₌₀ⁿ⁻¹ i = (1/n²) · n(n−1)/2 = (n−1)/(2n).'},
        {title:'Compute U(f,Pₙ)', content:'U = Σᵢ₌₁ⁿ i/n · (1/n) = (1/n²) · n(n+1)/2 = (n+1)/(2n). Note U − L = 1/n → 0.'},
        {title:'Take the limit', content:'sup L = lim (n−1)/(2n) = 1/2 = lim (n+1)/(2n) = inf U. So ∫₀¹ x dx = 1/2. ∎'}
      ], answer:'∫₀¹ x dx = 1/2'
    },
    { id:'i2', difficulty:2, statement:'Prove that every continuous function on [a,b] is Riemann integrable.',
      steps:[
        {title:'Use uniform continuity', content:'f is continuous on the compact set [a,b], hence uniformly continuous. Given ε > 0, ∃δ with |x−y| < δ ⟹ |f(x)−f(y)| < ε/(b−a).'},
        {title:'Choose a fine partition', content:'Take any partition P with mesh(P) = max Δxᵢ < δ. On each [xᵢ₋₁, xᵢ], Mᵢ − mᵢ < ε/(b−a) since the subinterval has width < δ.'},
        {title:'Bound U − L', content:'U(f,P) − L(f,P) = Σ(Mᵢ − mᵢ)Δxᵢ < [ε/(b−a)] · Σ Δxᵢ = [ε/(b−a)] · (b−a) = ε. ∎'},
      ], answer:'Continuous on [a,b] ⟹ Riemann integrable'
    },
    { id:'i3', difficulty:3, statement:'Prove FTC Part I: if f is continuous at c and F(x) = ∫ₐˣ f(t)dt, then F\'(c) = f(c).',
      steps:[
        {title:'Write the difference quotient', content:'(F(c+h) − F(c))/h = (1/h) ∫_c^{c+h} f(t)dt (by additivity of the integral).'},
        {title:'Compare to f(c)', content:'f(c) = (1/h) ∫_c^{c+h} f(c)dt (since f(c) is constant). So |(F(c+h)−F(c))/h − f(c)| = |1/h| · |∫_c^{c+h} [f(t)−f(c)]dt|.'},
        {title:'Use continuity', content:'Since f is continuous at c, for any ε > 0, ∃δ with |t−c| < δ ⟹ |f(t)−f(c)| < ε. For |h| < δ: the integrand is bounded by ε on [c, c+h].'},
        {title:'Finish', content:'|(F(c+h)−F(c))/h − f(c)| ≤ (1/|h|) · ε · |h| = ε. Since ε was arbitrary, F\'(c) = f(c). ∎'}
      ], answer:'F\'(c) = f(c)'
    },
    { id:'i4', difficulty:4, statement:'Prove: if f is Riemann integrable on [a,b], then |f| is Riemann integrable and |∫f| ≤ ∫|f|.',
      steps:[
        {title:'Show |f| is integrable', content:'Key inequality: on any interval, sup|f| − inf|f| ≤ sup f − inf f. This is because ||f(x)| − |f(y)|| ≤ |f(x) − f(y)| (reverse triangle inequality).'},
        {title:'Control U − L for |f|', content:'U(|f|,P) − L(|f|,P) ≤ U(f,P) − L(f,P) < ε for the same partition P that works for f. So |f| is integrable.'},
        {title:'Prove the inequality', content:'Since −|f(x)| ≤ f(x) ≤ |f(x)|, integrate: −∫|f| ≤ ∫f ≤ ∫|f|. This means |∫f| ≤ ∫|f|. ∎'},
        {title:'The triangle inequality for integrals', content:'This is the continuous analog of |Σaₙ| ≤ Σ|aₙ|. It\'s used constantly in analysis to bound integrals.'}
      ], answer:'|∫f| ≤ ∫|f|'
    },
    { id:'i5', difficulty:5, statement:'Prove FTC Part II: if F\' = f is continuous on [a,b], then ∫ₐᵇ f = F(b) − F(a).',
      steps:[
        {title:'Use a partition', content:'Let P = {a = x₀ < x₁ < ... < xₙ = b}. Telescope: F(b) − F(a) = Σᵢ₌₁ⁿ [F(xᵢ) − F(xᵢ₋₁)].'},
        {title:'Apply MVT to each piece', content:'On [xᵢ₋₁, xᵢ], by MVT: F(xᵢ) − F(xᵢ₋₁) = F\'(cᵢ) · Δxᵢ = f(cᵢ) · Δxᵢ for some cᵢ ∈ (xᵢ₋₁, xᵢ).'},
        {title:'Sum and bound', content:'F(b) − F(a) = Σ f(cᵢ)Δxᵢ. This is a Riemann sum for f. Since f is continuous (hence integrable), as mesh(P) → 0, this sum → ∫ₐᵇ f.'},
        {title:'Conclude', content:'F(b) − F(a) = lim Σ f(cᵢ)Δxᵢ = ∫ₐᵇ f. ∎ The MVT converts each telescoping piece into a Riemann sum term. This is why MVT is so fundamental.'}
      ], answer:'∫ₐᵇ f = F(b) − F(a)'
    }
  ],
  practice:[
    { id:'ip1', difficulty:1, statement:'Show that the Dirichlet function f(x) = 1 if x ∈ ℚ, f(x) = 0 if x ∉ ℚ is not Riemann integrable on [0,1].',
      steps:[
        { question:'For any partition P, what is the lower sum L(f,P)?', options:['0 — every subinterval contains irrationals, so inf = 0','1 — rationals are dense','Depends on the partition','1/2'],correct:0,
          explanations:['Correct! Every subinterval (xᵢ₋₁,xᵢ) contains irrational numbers, so inf f = 0 on each subinterval. Thus L(f,P) = 0.','The inf on each subinterval is 0, not 1.','The lower sum is 0 regardless of partition.','There\'s no averaging — we take inf on each piece.']},
        { question:'For any partition P, what is the upper sum U(f,P)?', options:['1 — every subinterval contains rationals, so sup = 1','0','(b−a) = 1','Depends on P'],correct:0,
          explanations:['Correct! Every subinterval contains rationals, so sup f = 1 on each subinterval. U(f,P) = Σ 1·Δxᵢ = 1.','The sup on each subinterval is 1, not 0.','U = Σ sup·Δxᵢ = 1·(b−a) = 1.','It\'s 1 regardless of partition.']},
        { question:'Since L = 0 and U = 1 for every P, the function is:', options:['Not Riemann integrable (sup L ≠ inf U)','Integrable with value 0','Integrable with value 1','Integrable with value 1/2'],correct:0,
          explanations:['Correct! sup L(f,P) = 0 ≠ 1 = inf U(f,P). Since upper and lower integrals don\'t match, f is not Riemann integrable. (It IS Lebesgue integrable with integral 0, since ℚ has measure zero.) ∎','sup L = 0 ≠ inf U = 1.','They don\'t match.','The upper and lower integrals differ.']}
      ]
    },
    { id:'ip2', difficulty:3, statement:'Prove: if f is Riemann integrable on [a,b] and f(x) ≥ 0 with f continuous at some c where f(c) > 0, then ∫ₐᵇ f > 0.',
      steps:[
        { question:'Since f is continuous at c with f(c) > 0, what can we find?', options:['An interval [c−δ,c+δ] ⊆ [a,b] where f(x) ≥ f(c)/2 > 0','A point where f = 0','A partition where L = 0','Nothing useful'],correct:0,
          explanations:['Correct! By continuity, ∃δ>0 with f(x) > f(c)/2 on (c−δ,c+δ) ∩ [a,b]. The function is bounded below by a positive constant on an interval of positive length.','f(c) > 0, so we can\'t use this to find a zero.','We\'re trying to show ∫f > 0, not L = 0.','Continuity gives a very useful neighborhood.']},
        { question:'How does this neighborhood give ∫f > 0?', options:['∫ₐᵇ f ≥ ∫_{c-δ}^{c+δ} f ≥ (f(c)/2)·2δ > 0','∫ₐᵇ f = f(c)·(b−a)','We need f > 0 everywhere','Apply MVT'],correct:0,
          explanations:['Correct! Since f ≥ 0 everywhere, ∫ₐᵇf ≥ ∫ over the subinterval. On [c−δ,c+δ], f ≥ f(c)/2, so the integral over that piece ≥ f(c)/2 · 2δ > 0.','That would require f constant.','f ≥ 0 everywhere and f > f(c)/2 > 0 on a subinterval is sufficient.','MVT is for derivatives, not integrals directly.']},
        { question:'Why is the condition "f continuous at some c with f(c) > 0" essential?', options:['Without it, f could be 0 except at finitely many points (integral = 0)','f might not be integrable','The proof wouldn\'t use continuity','It isn\'t essential'],correct:0,
          explanations:['Correct! If f(x) = 0 except f(1/2) = 1, then f ≥ 0 and f(1/2) > 0, but ∫₀¹f = 0. We need continuity at the positive point to get a whole interval where f is bounded away from 0. ∎','We assumed f is integrable.','The proof crucially uses continuity to get a positive-length interval.','It is essential — see the counterexample.']}
      ]
    },
    { id:'ip3', difficulty:5, statement:'Prove the integral mean value theorem: if f is continuous on [a,b], then ∃c ∈ [a,b] with ∫ₐᵇ f = f(c)(b−a).',
      steps:[
        { question:'By EVT, f attains its min m and max M on [a,b]. What bounds does this give on ∫f?', options:['m(b−a) ≤ ∫ₐᵇ f ≤ M(b−a)','∫ₐᵇ f = (m+M)(b−a)/2','m ≤ ∫ₐᵇ f ≤ M','0 ≤ ∫ₐᵇ f ≤ M(b−a)'],correct:0,
          explanations:['Correct! Since m ≤ f(x) ≤ M, integrating: m(b−a) ≤ ∫f ≤ M(b−a). Dividing by (b−a): m ≤ (1/(b−a))∫f ≤ M.','That\'s the average of extremes, not an integral bound.','The integral has dimensions of f times length.','m might be negative.']},
        { question:'So m ≤ (1/(b−a))∫f ≤ M. Which theorem guarantees ∃c with f(c) = (1/(b−a))∫f?', options:['IVT — f is continuous and (1/(b−a))∫f is between f\'s min and max','MVT','EVT','Rolle\'s theorem'],correct:0,
          explanations:['Correct! The value (1/(b−a))∫f lies between min and max of f. Since f is continuous on [a,b] (connected), IVT gives c with f(c) = (1/(b−a))∫f.','MVT is about derivatives; this is about integral averages.','EVT says min and max exist, which we already used.','Rolle\'s requires equal endpoint values.']},
        { question:'f(c) = (1/(b−a))∫f rearranges to ∫ₐᵇf = f(c)(b−a). What is the geometric meaning?', options:['The "average value" f(c) times the width equals the area — there\'s a rectangle with the same area','f is constant','The integral equals the midpoint value times width','f(c) = f\'(something)'],correct:0,
          explanations:['Correct! f(c) is the average value of f on [a,b]. The rectangle with height f(c) and width (b−a) has the same area as the region under the curve. This is the integral analog of the MVT. ∎','f need not be constant.','The midpoint might not give the average value (that\'s only true for linear f).','This involves f, not f\'.']}
      ]
    }
  ]
},
{
  id:'funcseq', num:8, title:'Sequences & Series of Functions', subtitle:'Pointwise and uniform convergence, power series',
  defs:[
    { term:'Pointwise Convergence', formal:'A sequence of functions (fₙ) converges pointwise to f on S if for every x ∈ S, lim_{n→∞} fₙ(x) = f(x). That is, for each fixed x and each ε > 0, ∃N(x,ε) with |fₙ(x)−f(x)| < ε for n ≥ N.',
      intuition:'At each individual point, the sequence of numbers fₙ(x) converges to f(x). But the speed of convergence can vary wildly from point to point — N depends on x. This is the weak form of convergence for functions.',
      example:'fₙ(x) = xⁿ on [0,1]. For x ∈ [0,1): xⁿ → 0. At x=1: 1ⁿ = 1. Pointwise limit: f(x)=0 for x∈[0,1), f(1)=1. Note: each fₙ is continuous but f is NOT.'
    },
    { term:'Uniform Convergence', formal:'(fₙ) converges uniformly to f on S if for every ε > 0, ∃N such that for ALL x ∈ S AND all n ≥ N, |fₙ(x) − f(x)| < ε. Equivalently, sup_{x∈S} |fₙ(x)−f(x)| → 0.',
      intuition:'ONE N works for ALL x simultaneously. The entire graph of fₙ is within an ε-tube around f. Uniform convergence preserves continuity, integrability, and (with care) differentiability. It\'s the "right" notion of convergence for functions.',
      example:'fₙ(x) = x/n → 0 uniformly on [0,1]: sup|x/n| = 1/n → 0. But fₙ(x) = xⁿ does NOT converge uniformly on [0,1] — the sup difference is 1 for all n.'
    },
    { term:'Weierstrass M-test', formal:'If |fₙ(x)| ≤ Mₙ for all x ∈ S and Σ Mₙ converges, then Σ fₙ(x) converges uniformly (and absolutely) on S.',
      intuition:'Bound each function by a constant, then check if the constants form a convergent series. If the "worst case at every point" series converges, the function series converges uniformly. It\'s the comparison test lifted to function series.',
      example:'Σ sin(nx)/n² on ℝ: |sin(nx)/n²| ≤ 1/n² and Σ1/n² converges. By M-test, the series converges uniformly.'
    },
    { term:'Power Series and Radius of Convergence', formal:'A power series Σ aₙxⁿ converges absolutely for |x| < R and diverges for |x| > R, where R = 1/limsup|aₙ|^{1/n} is the radius of convergence. Convergence is uniform on [−r,r] for any r < R.',
      intuition:'Every power series has a "zone of convergence" — a symmetric interval (−R, R) where it converges. Inside the interval: absolute convergence. Outside: divergence. At the endpoints: anything can happen. Within any strictly smaller interval, convergence is uniform.',
      example:'Σ xⁿ/n! has R = ∞ (converges everywhere to eˣ). Σ xⁿ has R = 1. Σ xⁿ/n has R = 1 (converges at x=−1, diverges at x=1).'
    }
  ],
  explained:[
    { id:'f1', difficulty:1, statement:'Show that fₙ(x) = x/n converges uniformly to 0 on [0,1].',
      steps:[
        {title:'Compute the sup norm', content:'sup_{x∈[0,1]} |fₙ(x) − 0| = sup_{x∈[0,1]} |x/n| = 1/n (achieved at x = 1).'},
        {title:'Show it goes to 0', content:'1/n → 0 as n → ∞. So sup|fₙ(x)| → 0, which is the definition of uniform convergence. ∎'}
      ], answer:'fₙ → 0 uniformly on [0,1]'
    },
    { id:'f2', difficulty:2, statement:'Show that fₙ(x) = xⁿ does NOT converge uniformly on [0,1].',
      steps:[
        {title:'Find the pointwise limit', content:'For x ∈ [0,1): xⁿ → 0. At x = 1: 1ⁿ = 1. So f(x) = 0 for x < 1, f(1) = 1.'},
        {title:'Each fₙ is continuous but f is not', content:'fₙ(x) = xⁿ is continuous, but the limit f is discontinuous at x = 1.'},
        {title:'Conclude non-uniform convergence', content:'If convergence were uniform and each fₙ is continuous, then the limit must be continuous (this is a theorem). Since f is not continuous, the convergence cannot be uniform. ∎'},
      ], answer:'Convergence is NOT uniform'
    },
    { id:'f3', difficulty:3, statement:'Prove: if fₙ → f uniformly on [a,b] and each fₙ is continuous, then f is continuous.',
      steps:[
        {title:'Fix c ∈ [a,b] and ε > 0', content:'We need δ > 0 with |x−c| < δ ⟹ |f(x)−f(c)| < ε.'},
        {title:'Use the ε/3 trick', content:'By uniform convergence, ∃N with |fₙ(x)−f(x)| < ε/3 for ALL x and n ≥ N. Fix this N.'},
        {title:'Use continuity of fₙ', content:'fₙ is continuous at c, so ∃δ with |x−c| < δ ⟹ |fₙ(x)−fₙ(c)| < ε/3.'},
        {title:'Triangle inequality', content:'|f(x)−f(c)| ≤ |f(x)−fₙ(x)| + |fₙ(x)−fₙ(c)| + |fₙ(c)−f(c)| < ε/3 + ε/3 + ε/3 = ε. ∎ The ε/3 trick bridges f and fₙ at two points via the known-continuous fₙ.'}
      ], answer:'Uniform limit of continuous functions is continuous'
    },
    { id:'f4', difficulty:4, statement:'Prove: if fₙ → f uniformly on [a,b] and each fₙ is Riemann integrable, then f is integrable and ∫fₙ → ∫f.',
      steps:[
        {title:'Show f is integrable', content:'Given ε > 0, choose N with |fₙ(x)−f(x)| < ε/(3(b−a)) for all x. Then fₙ integrable + close to f ⟹ f integrable (using U(f)−L(f) bounds).'},
        {title:'Bound the integral difference', content:'|∫ₐᵇ fₙ − ∫ₐᵇ f| = |∫ₐᵇ(fₙ−f)| ≤ ∫ₐᵇ |fₙ−f| ≤ sup|fₙ−f| · (b−a).'},
        {title:'Use uniform convergence', content:'sup|fₙ−f| → 0, so sup|fₙ−f|·(b−a) → 0. Therefore ∫fₙ → ∫f. ∎'},
        {title:'Key point', content:'We can swap lim and ∫ under uniform convergence: lim ∫fₙ = ∫ lim fₙ. This fails for pointwise convergence! (Example: tall thin bumps with area 1 converge pointwise to 0.)'}
      ], answer:'∫fₙ → ∫f (interchange of limit and integral)'
    },
    { id:'f5', difficulty:5, statement:'Prove the Weierstrass M-test: if |fₙ(x)| ≤ Mₙ for all x ∈ S and Σ Mₙ converges, then Σ fₙ converges uniformly on S.',
      steps:[
        {title:'Pointwise absolute convergence', content:'For each fixed x: Σ|fₙ(x)| ≤ Σ Mₙ < ∞. So Σ fₙ(x) converges absolutely for each x. Let F(x) = Σ fₙ(x).'},
        {title:'Bound the tail uniformly', content:'Let Sₙ(x) = Σₖ₌₁ⁿ fₖ(x). Then |F(x) − Sₙ(x)| = |Σₖ₌ₙ₊₁^∞ fₖ(x)| ≤ Σₖ₌ₙ₊₁^∞ |fₖ(x)| ≤ Σₖ₌ₙ₊₁^∞ Mₖ.'},
        {title:'The bound is independent of x', content:'The tail Rₙ = Σₖ₌ₙ₊₁^∞ Mₖ depends only on n, not on x. Since Σ Mₖ converges, Rₙ → 0.'},
        {title:'Conclude uniform convergence', content:'sup_{x∈S} |F(x) − Sₙ(x)| ≤ Rₙ → 0. So Sₙ → F uniformly on S. ∎ The key: the M-bounds are uniform in x, so the convergence is uniform.'}
      ], answer:'Σ fₙ converges uniformly (Weierstrass M-test)'
    }
  ],
  practice:[
    { id:'fp1', difficulty:1, statement:'Does fₙ(x) = nx·e^{−nx²} converge uniformly on [0,∞)?',
      steps:[
        { question:'Find the pointwise limit: for fixed x > 0, what is lim fₙ(x)?', options:['0 (exponential decay dominates)','∞','x','1'],correct:0,
          explanations:['Correct! For x > 0: fₙ(x) = nx·e^{−nx²}. As n → ∞, the exponent −nx² → −∞, so e^{−nx²} → 0 faster than nx → ∞. At x=0: fₙ(0) = 0. So f(x) = 0 for all x ≥ 0.','The exponential decay wins over the linear growth.','The limit is 0, not x.','Only if nx·e^{−nx²} → 1, which it doesn\'t.']},
        { question:'Find the maximum of fₙ(x) on [0,∞). Set fₙ\'(x) = 0.', options:['Max at x = 1/√(2n), giving fₙ = √(n/(2e))','Max at x = 1/n','Max at x = n','No maximum exists'],correct:0,
          explanations:['Correct! fₙ\'(x) = n·e^{−nx²}(1−2nx²) = 0 at x = 1/√(2n). fₙ(1/√(2n)) = n/√(2n) · e^{−1/2} = √(n/2)/√e → ∞!','At x=1/n: fₙ = n·(1/n)·e^{−1/n} = e^{−1/n} → 1. But the actual max is larger.','At x=n: fₙ = n²e^{−n³} → 0 (not the max).','The max exists since fₙ(0)=0 and fₙ(x)→0 as x→∞.']},
        { question:'Since sup fₙ = √(n/(2e)) → ∞, the convergence is:', options:['NOT uniform (sup|fₙ−f| → ∞, not 0)','Uniform','Pointwise only, and f ≡ 0','Both pointwise and uniform'],correct:0,
          explanations:['Correct! sup_{x≥0}|fₙ(x)−0| = √(n/(2e)) → ∞. For uniform convergence we need this → 0. So convergence is pointwise but not uniform on [0,∞). ∎','sup|fₙ| → ∞, which is the opposite of uniform convergence.','Correct that it\'s pointwise with f≡0, but "NOT uniform" is the stronger answer.','Not uniform since the sup norm diverges.']}
      ]
    },
    { id:'fp2', difficulty:3, statement:'Prove Σ xⁿ/n² converges uniformly on [−1,1].',
      steps:[
        { question:'What bound can we use for |xⁿ/n²| on [−1,1]?', options:['|xⁿ/n²| ≤ 1/n² since |x| ≤ 1','|xⁿ/n²| ≤ 1/n','|xⁿ/n²| ≤ xⁿ','No useful bound exists'],correct:0,
          explanations:['Correct! For |x| ≤ 1: |xⁿ| ≤ 1, so |xⁿ/n²| ≤ 1/n². The bound is independent of x — perfect for the M-test.','1/n is too loose. We can do better: 1/n².','xⁿ depends on x, so it\'s not a constant bound.','1/n² is a very useful bound.']},
        { question:'Set Mₙ = 1/n². Does Σ Mₙ converge?', options:['Yes — Σ1/n² = π²/6 (p-series with p=2 > 1)','No — it\'s like the harmonic series','Only conditionally','Cannot determine'],correct:0,
          explanations:['Correct! Σ 1/n² converges (p-series, p=2>1). This was proved in Chapter 3 by comparison.','Σ1/n² converges, unlike Σ1/n. The extra power makes all the difference.','Convergence is absolute since all terms are positive.','We proved this converges in the Series chapter.']},
        { question:'By the Weierstrass M-test:', options:['Σ xⁿ/n² converges uniformly on [−1,1]','Σ xⁿ/n² converges only pointwise','We need another test','The series diverges at x = ±1'],correct:0,
          explanations:['Correct! |xⁿ/n²| ≤ 1/n² = Mₙ and Σ Mₙ converges. By M-test, Σ xⁿ/n² converges uniformly (and absolutely) on [−1,1]. Since each partial sum is continuous, the limit function is also continuous on [−1,1]. ∎','The M-test gives uniform convergence, not just pointwise.','The M-test is sufficient.','At x=±1, Σ(±1)ⁿ/n² converges (absolutely).']}
      ]
    },
    { id:'fp3', difficulty:5, statement:'Find the radius of convergence of Σ nⁿxⁿ/n! and determine convergence at R and −R.',
      steps:[
        { question:'Apply the ratio test: |aₙ₊₁xⁿ⁺¹|/|aₙxⁿ| = |(n+1)ⁿ⁺¹·x|/((n+1)!·n!/nⁿ·1). Simplify the ratio |aₙ₊₁/aₙ|.', options:['((n+1)/n)ⁿ · |x| → e·|x|','n·|x|','|x|/n','(n+1)|x|'],correct:0,
          explanations:['Correct! aₙ₊₁/aₙ = (n+1)ⁿ⁺¹/((n+1)·nⁿ) = ((n+1)/n)ⁿ. And ((n+1)/n)ⁿ = (1+1/n)ⁿ → e. So the ratio is e|x|.','That would give R = 0, but the series has positive radius.','That would give R = ∞, which is too generous.','The (n+1)/n)ⁿ factor gives e, not just (n+1).']},
        { question:'The ratio test gives convergence when e|x| < 1. What is R?', options:['R = 1/e','R = e','R = 1','R = ∞'],correct:0,
          explanations:['Correct! e|x| < 1 ⟺ |x| < 1/e. So the radius of convergence is R = 1/e.','e|x| < 1 means |x| < 1/e, not |x| < e.','The factor e from (1+1/n)ⁿ shifts the radius.','The factorial doesn\'t grow fast enough to give R = ∞ here.']},
        { question:'At x = 1/e: the terms are nⁿ/(n!·eⁿ). By Stirling\'s approximation n! ≈ √(2πn)·(n/e)ⁿ, these terms behave like:', options:['1/√(2πn) → 0 but Σ1/√n diverges, so the series diverges at x=1/e','The terms → 0 so it converges','The terms grow, so diverges','Cannot determine'],correct:0,
          explanations:['Correct! nⁿ/(n!·eⁿ) ≈ nⁿ/(√(2πn)·nⁿ/eⁿ·eⁿ) = 1/√(2πn). The terms → 0 but too slowly (like 1/√n), so the series diverges. Similarly at x = −1/e by the same estimate. ∎','Terms → 0 is necessary but not sufficient. The rate matters.','The terms do go to 0, but too slowly for convergence.','Stirling\'s approximation resolves this.']}
      ]
    }
  ]
}
];

export default function RealAnalysis() {
  const [view, setView] = useState('home');
  const [chIdx, setChIdx] = useState(0);
  const [phase, setPhase] = useState('defs');
  const [probIdx, setProbIdx] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState([]);
  const [expandedDefs, setExpandedDefs] = useState({});
  const [pState, setPState] = useState({si:0,sel:null,answered:false,results:[]});
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [progress, setProgress] = useState({});
  const [anim, setAnim] = useState(0);
  const scrollRef = useRef(null);
  const ch = CHAPTERS[chIdx];

  useEffect(() => {
    const l = document.createElement('link');
    l.href = 'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
    l.rel = 'stylesheet'; document.head.appendChild(l);
  }, []);

  const scrollTop = () => { if(scrollRef.current) scrollRef.current.scrollTop = 0; };
  const goHome = () => { setView('home'); setPhase('defs'); setProbIdx(0); setRevealedSteps([]); setExpandedDefs({}); setPState({si:0,sel:null,answered:false,results:[]}); };
  const startChapter = (i) => { setChIdx(i); setView('chapter'); setPhase('defs'); setProbIdx(0); setRevealedSteps([]); setExpandedDefs({}); setScore(0); setTotal(0); setAnim(a=>a+1); };
  const goExplained = () => { setPhase('explained'); setProbIdx(0); setRevealedSteps([]); setAnim(a=>a+1); scrollTop(); };
  const goPractice = () => { setPhase('practice'); setProbIdx(0); setPState({si:0,sel:null,answered:false,results:[]}); setScore(0); setTotal(0); setAnim(a=>a+1); scrollTop(); };
  const nextExplained = () => {
    if (probIdx < ch.explained.length - 1) { setProbIdx(i=>i+1); setRevealedSteps([]); setAnim(a=>a+1); scrollTop(); }
    else goPractice();
  };
  const nextPractice = () => {
    if (probIdx < ch.practice.length - 1) { setProbIdx(i=>i+1); setPState({si:0,sel:null,answered:false,results:[]}); setAnim(a=>a+1); scrollTop(); }
    else { setPhase('done'); setProgress(p=>({...p,[ch.id]:Math.max(p[ch.id]||0, total>0?Math.round(score/total*100):0)})); setConfetti(true); setTimeout(()=>setConfetti(false),3000); }
  };
  const handleSelect = (i) => { if(!pState.answered) setPState(s=>({...s,sel:i})); };
  const handleSubmit = () => {
    if(pState.sel===null) return;
    const step = ch.practice[probIdx].steps[pState.si];
    const correct = pState.sel === step.correct;
    if(correct) setScore(s=>s+1);
    setTotal(t=>t+1);
    setPState(s=>({...s,answered:true,results:[...s.results,{correct}]}));
  };
  const handleNextStep = () => {
    if(pState.si < ch.practice[probIdx].steps.length-1) { setPState(s=>({...s,si:s.si+1,sel:null,answered:false})); setAnim(a=>a+1); }
    else setPState(s=>({...s,si:s.si+1}));
  };
  const getProgress = () => {
    if(phase==='defs') return 0.05;
    if(phase==='explained') return 0.1 + (probIdx/ch.explained.length)*0.5;
    if(phase==='practice') return 0.6 + (probIdx/ch.practice.length)*0.35;
    return 1;
  };

  const CSS = `
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
    @keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
    @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
    @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
    .au{animation:fadeUp .4s ease-out forwards;opacity:0}
    .si{animation:slideIn .3s ease-out forwards}
    .pi{animation:popIn .3s ease-out forwards}
    .sk{animation:shake .3s ease-in-out}
    *{box-sizing:border-box;margin:0;padding:0}
    button{font-family:inherit}
  `;

  const Confetti = () => {
    if(!confetti) return null;
    const colors = [T.accent,T.blue,T.ok,'#f59e0b','#8b5cf6',T.err];
    const ps = Array.from({length:35},(_,i)=>({id:i,l:Math.random()*100,c:colors[i%colors.length],d:Math.random()*.7,s:4+Math.random()*6}));
    return <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:99,overflow:'hidden'}}>
      {ps.map(p=><div key={p.id} style={{position:'absolute',left:p.l+'%',top:'-10px',width:p.s,height:p.s,background:p.c,borderRadius:Math.random()>.5?'50%':'2px',animation:`confettiFall 2.5s ease-in ${p.d}s forwards`}}/>)}
    </div>;
  };

  const TopBar = () => (
    <div style={{position:'sticky',top:0,zIndex:40,background:T.bg+'ee',backdropFilter:'blur(12px)',borderBottom:'1px solid '+T.border,padding:'12px 16px'}}>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
          <button onClick={goHome} style={{background:'none',border:'none',color:T.textMuted,cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontSize:13,fontFamily:BODY,padding:0}}>
            <ArrowLeft size={14}/> Course
          </button>
          <span style={{fontSize:12,fontWeight:600,padding:'3px 10px',borderRadius:20,background:phase==='defs'?T.blueDim:phase==='explained'?T.accentDim:phase==='practice'?T.okDim:T.accentDim,color:phase==='defs'?T.blue:phase==='explained'?T.accent:phase==='practice'?T.ok:T.accent,fontFamily:BODY}}>
            {phase==='defs'?'Definitions':phase==='explained'?`Problem ${probIdx+1}/5`:phase==='practice'?`Practice ${probIdx+1}/3`:'Complete'}
          </span>
        </div>
        <div style={{height:3,background:T.surfaceLight,borderRadius:2,overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:2,background:`linear-gradient(90deg,${T.accent},${T.accentLight})`,transition:'width .6s ease-out',width:(getProgress()*100)+'%'}}/>
        </div>
      </div>
    </div>
  );

  // ═══ HOME ═══
  if(view==='home') return (
    <div ref={scrollRef} style={{minHeight:'100vh',background:T.bg,color:T.text,fontFamily:BODY,overflowY:'auto'}}>
      <style>{CSS}</style>
      <div style={{maxWidth:720,margin:'0 auto',padding:'24px 16px 80px'}}>
        <div className="au" style={{textAlign:'center',marginBottom:48,animationDelay:'.05s'}}>
          <div style={{fontSize:48,marginBottom:8,fontFamily:'serif'}}>\u211D</div>
          <h1 style={{fontFamily:FONT,fontSize:'clamp(28px,6vw,42px)',fontWeight:700,color:T.accent,marginBottom:8,letterSpacing:'-0.02em'}}>Real Analysis</h1>
          <p style={{color:T.textMuted,fontSize:15,maxWidth:420,margin:'0 auto',lineHeight:1.6}}>A complete interactive course from the axioms of the reals through Riemann integration and uniform convergence.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:20,flexWrap:'wrap'}}>
            {[['8 Chapters',T.accent],['64 Problems',T.blue],['College Level',T.ok]].map(([t,c])=>(
              <div key={t} style={{background:T.surface,borderRadius:10,padding:'8px 14px',fontSize:12,color:T.textMuted,border:'1px solid '+T.border}}>{t}</div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {CHAPTERS.map((c,i)=>{
            const pct=progress[c.id]||0; const done=pct>0;
            return (
              <button key={c.id} onClick={()=>startChapter(i)} className="au" style={{animationDelay:(0.1+i*0.05)+'s',width:'100%',textAlign:'left',background:T.surface,border:'1px solid '+(done?T.accent+'30':T.border),borderRadius:16,padding:20,cursor:'pointer',transition:'all .2s',color:T.text,position:'relative',overflow:'hidden',fontFamily:BODY}}>
                <div style={{display:'flex',alignItems:'center',gap:16}}>
                  <div style={{width:44,height:44,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:MONO,fontSize:16,fontWeight:700,background:done?T.accentDim:T.surfaceLight,color:done?T.accent:T.textDim,border:'1px solid '+(done?T.accent+'40':T.borderLight),flexShrink:0}}>{c.num}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:FONT,fontSize:17,fontWeight:600,marginBottom:2,color:done?T.accent:T.text}}>{c.title}</div>
                    <div style={{fontSize:12,color:T.textMuted,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.subtitle}</div>
                  </div>
                  <div style={{flexShrink:0,display:'flex',alignItems:'center',gap:6}}>
                    {done&&<span style={{fontSize:11,color:T.accent,fontWeight:600}}>{pct}%</span>}
                    <ChevronRight size={16} color={T.textDim}/>
                  </div>
                </div>
                {done&&<div style={{position:'absolute',bottom:0,left:0,height:2,background:T.accent,width:pct+'%'}}/>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ═══ DEFINITIONS ═══
  if(phase==='defs') return (
    <div ref={scrollRef} style={{minHeight:'100vh',background:T.bg,color:T.text,fontFamily:BODY,overflowY:'auto'}}>
      <style>{CSS}</style><TopBar/>
      <div style={{maxWidth:720,margin:'0 auto',padding:'24px 16px 100px'}}>
        <div className="au" style={{marginBottom:28,animationDelay:'.05s'}}>
          <div style={{fontSize:11,color:T.accent,fontWeight:700,textTransform:'uppercase',letterSpacing:2,marginBottom:8}}>Chapter {ch.num}</div>
          <h2 style={{fontFamily:FONT,fontSize:'clamp(22px,5vw,30px)',fontWeight:700,marginBottom:4}}>{ch.title}</h2>
          <p style={{color:T.textMuted,fontSize:14}}>{ch.subtitle}</p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {ch.defs.map((d,i)=>{
            const open=expandedDefs[i];
            return (
              <div key={i} className="au" style={{animationDelay:(0.1+i*.06)+'s',borderRadius:14,overflow:'hidden',background:open?T.surfaceLight:T.surface,border:'1px solid '+(open?T.accent+'30':T.border),transition:'all .3s'}}>
                <button onClick={()=>setExpandedDefs(x=>({...x,[i]:!x[i]}))} style={{width:'100%',textAlign:'left',padding:'16px 18px',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',color:T.text,fontFamily:BODY}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <BookOpen size={15} color={T.accent}/>
                    <span style={{fontFamily:FONT,fontSize:16,fontWeight:600}}>{d.term}</span>
                  </div>
                  <ChevronDown size={15} color={T.textMuted} style={{transition:'transform .3s',transform:open?'rotate(180deg)':'none'}}/>
                </button>
                {open&&(
                  <div style={{padding:'0 18px 18px',display:'flex',flexDirection:'column',gap:10}} className="pi">
                    <div style={{background:T.bg,borderRadius:10,padding:14}}>
                      <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:1.5,color:T.textDim,marginBottom:5}}>Formal Definition</div>
                      <p style={{fontSize:13,color:T.textMuted,lineHeight:1.7,fontFamily:MONO}}>{d.formal}</p>
                    </div>
                    <div style={{background:T.accentDim,border:'1px solid '+T.accent+'20',borderRadius:10,padding:14}}>
                      <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:5}}>
                        <Lightbulb size={11} color={T.accent}/>
                        <span style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:1.5,color:T.accent}}>Intuition</span>
                      </div>
                      <p style={{fontSize:14,color:T.text,lineHeight:1.7}}>{d.intuition}</p>
                    </div>
                    <div style={{background:T.surface,borderRadius:10,padding:14,border:'1px solid '+T.border}}>
                      <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:1.5,color:T.textDim,marginBottom:5}}>Example</div>
                      <p style={{fontSize:13,color:T.textMuted,lineHeight:1.7,fontFamily:MONO}}>{d.example}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={goExplained} className="au" style={{animationDelay:'.4s',width:'100%',marginTop:24,padding:'15px 24px',borderRadius:12,border:'none',background:`linear-gradient(135deg,${T.accent},${T.accentLight})`,color:T.bg,fontSize:16,fontWeight:700,fontFamily:FONT,cursor:'pointer'}}>
          Begin Worked Examples \u2192
        </button>
      </div>
    </div>
  );

  // ═══ EXPLAINED ═══
  if(phase==='explained') {
    const prob=ch.explained[probIdx]; const allR=revealedSteps.length===prob.steps.length;
    return (
      <div key={'e'+anim} ref={scrollRef} style={{minHeight:'100vh',background:T.bg,color:T.text,fontFamily:BODY,overflowY:'auto'}}>
        <style>{CSS}</style><TopBar/>
        <div style={{maxWidth:720,margin:'0 auto',padding:'24px 16px 100px'}}>
          <div className="au" style={{display:'flex',gap:6,marginBottom:16,animationDelay:'.05s'}}>
            {[1,2,3,4,5].map(d=><div key={d} style={{flex:1,height:4,borderRadius:2,background:d<=prob.difficulty?T.accent:T.surfaceLight}}/>)}
            <span style={{fontSize:11,color:T.textDim,marginLeft:4}}>Lv {prob.difficulty}</span>
          </div>
          <div className="au" style={{animationDelay:'.1s',borderRadius:14,padding:'22px 18px',marginBottom:24,background:`linear-gradient(135deg,${T.accentDim},${T.surface})`,border:'1px solid '+T.accent+'25'}}>
            <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:2,color:T.accent,marginBottom:8}}>Problem {probIdx+1}</div>
            <p style={{fontFamily:FONT,fontSize:'clamp(16px,4vw,19px)',fontWeight:600,lineHeight:1.5}}>{prob.statement}</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
            {prob.steps.map((step,i)=>{
              const revealed=revealedSteps.includes(i);
              const isNext=!revealed&&(i===0||revealedSteps.includes(i-1));
              if(!revealed&&!isNext) return null;
              if(isNext) return (
                <button key={i} onClick={()=>setRevealedSteps(s=>[...s,i])} className="au" style={{animationDelay:'.1s',width:'100%',textAlign:'left',padding:14,borderRadius:12,background:'none',border:'1px dashed '+T.accent+'50',cursor:'pointer',color:T.accent,display:'flex',alignItems:'center',gap:10,fontFamily:BODY,fontSize:14}}>
                  <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,background:T.accentDim,flexShrink:0}}>{i+1}</div>
                  <Eye size={13}/> Reveal: {step.title}
                </button>
              );
              return (
                <div key={i} className="si" style={{padding:14,borderRadius:12,background:T.surface,border:'1px solid '+T.border}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                    <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,background:T.accentDim,color:T.accent,flexShrink:0,marginTop:2}}>{i+1}</div>
                    <div><div style={{fontSize:13,fontWeight:600,color:T.accent,marginBottom:3}}>{step.title}</div>
                    <p style={{fontSize:14,color:T.textMuted,lineHeight:1.7}}>{step.content}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
          {allR&&(
            <div className="pi">
              <div style={{borderRadius:12,padding:14,marginBottom:16,display:'flex',alignItems:'center',gap:10,background:T.okDim,border:'1px solid '+T.ok+'30'}}>
                <Check size={16} color={T.ok}/>
                <div><div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:1.5,color:T.ok,marginBottom:2}}>Answer</div>
                <div style={{fontFamily:MONO,fontSize:14,fontWeight:600,color:T.ok}}>{prob.answer}</div></div>
              </div>
              <button onClick={nextExplained} style={{width:'100%',padding:'15px 24px',borderRadius:12,border:'none',background:`linear-gradient(135deg,${T.accent},${T.accentLight})`,color:T.bg,fontSize:16,fontWeight:700,fontFamily:FONT,cursor:'pointer'}}>
                {probIdx<ch.explained.length-1?'Next Problem \u2192':'Start Practice \u2192'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══ PRACTICE ═══
  if(phase==='practice') {
    const prob=ch.practice[probIdx]; const {si,sel,answered,results}=pState;
    const allDone=si>=prob.steps.length; const step=allDone?null:prob.steps[si];
    return (
      <div key={'p'+anim} ref={scrollRef} style={{minHeight:'100vh',background:T.bg,color:T.text,fontFamily:BODY,overflowY:'auto'}}>
        <style>{CSS}</style><TopBar/>
        <div style={{maxWidth:720,margin:'0 auto',padding:'24px 16px 100px'}}>
          <div style={{display:'flex',gap:6,marginBottom:16}}>
            {[1,2,3,4,5].map(d=><div key={d} style={{flex:1,height:4,borderRadius:2,background:d<=prob.difficulty?T.blue:T.surfaceLight}}/>)}
            <span style={{fontSize:11,color:T.textDim,marginLeft:4}}>Lv {prob.difficulty}</span>
          </div>
          <div style={{borderRadius:14,padding:'22px 18px',marginBottom:24,background:`linear-gradient(135deg,${T.blueDim},${T.surface})`,border:'1px solid '+T.blue+'25'}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
              <Target size={13} color={T.blue}/>
              <span style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:2,color:T.blue}}>Practice {probIdx+1}</span>
            </div>
            <p style={{fontFamily:FONT,fontSize:'clamp(15px,3.5vw,18px)',fontWeight:600,lineHeight:1.5}}>{prob.statement}</p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:20}}>
            {prob.steps.map((_,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:6}}>
                <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,
                  background:i<si?(results[i]?.correct?T.okDim:T.errDim):i===si&&!allDone?T.blueDim:T.surfaceLight,
                  color:i<si?(results[i]?.correct?T.ok:T.err):i===si&&!allDone?T.blue:T.textDim,
                  border:'2px solid '+(i===si&&!allDone?T.blue:'transparent')}}>
                  {i<si?(results[i]?.correct?<Check size={11}/>:<X size={11}/>):i+1}
                </div>
                {i<prob.steps.length-1&&<div style={{width:16,height:2,borderRadius:1,background:i<si?T.ok+'40':T.surfaceLight}}/>}
              </div>
            ))}
          </div>
          {!allDone?(<>
            <p style={{fontSize:15,fontWeight:500,marginBottom:16,lineHeight:1.6}}>Step {si+1}: {step.question}</p>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
              {step.options.map((opt,i)=>{
                const isSel=sel===i,isCorr=answered&&i===step.correct,isWrong=answered&&isSel&&i!==step.correct;
                let bg=T.surface,bdr=T.border;
                if(!answered&&isSel){bg=T.blueDim;bdr=T.blue;}
                if(isCorr){bg=T.okDim;bdr=T.ok;}
                if(isWrong){bg=T.errDim;bdr=T.err;}
                return (
                  <button key={i} onClick={()=>handleSelect(i)} disabled={answered} className={isWrong?'sk':''} style={{width:'100%',textAlign:'left',padding:14,borderRadius:12,background:bg,border:'2px solid '+bdr,cursor:answered?'default':'pointer',transition:'all .2s',color:T.text,fontFamily:BODY,fontSize:14,opacity:answered&&!isCorr&&!isWrong?.45:1}}>
                    <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                      <div style={{width:26,height:26,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,background:isCorr?T.okDim:isWrong?T.errDim:T.surfaceLight,color:isCorr?T.ok:isWrong?T.err:T.blue,flexShrink:0,marginTop:1}}>
                        {isCorr?<Check size={13}/>:isWrong?<X size={13}/>:String.fromCharCode(65+i)}
                      </div>
                      <span style={{lineHeight:1.5}}>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {!answered&&sel!==null&&(
              <button onClick={handleSubmit} className="pi" style={{width:'100%',padding:'13px 24px',borderRadius:12,border:'none',background:T.blue,color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:BODY}}>Check Answer</button>
            )}
            {answered&&(
              <div className="pi" style={{display:'flex',flexDirection:'column',gap:10}}>
                <div style={{borderRadius:12,padding:14,background:sel===step.correct?T.okDim:T.errDim,border:'1px solid '+(sel===step.correct?T.ok:T.err)+'30'}}>
                  <p style={{fontSize:14,color:sel===step.correct?T.ok:T.err,lineHeight:1.7}}>{step.explanations[sel]}</p>
                </div>
                <button onClick={handleNextStep} style={{width:'100%',padding:'13px 24px',borderRadius:12,border:'none',background:`linear-gradient(135deg,${T.accent},${T.accentLight})`,color:T.bg,fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:BODY}}>
                  {si<prob.steps.length-1?'Next Step \u2192':'Continue \u2192'}
                </button>
              </div>
            )}
          </>):(
            <div className="pi" style={{textAlign:'center'}}>
              <div style={{background:T.surface,borderRadius:16,padding:28,marginBottom:16,border:'1px solid '+T.border}}>
                <div style={{fontSize:32,marginBottom:10}}>{results.every(r=>r.correct)?'\u2728':results.filter(r=>r.correct).length>0?'\uD83D\uDC4D':'\uD83D\uDCAA'}</div>
                <div style={{fontSize:18,fontWeight:700,fontFamily:FONT,marginBottom:4}}>{results.filter(r=>r.correct).length}/{results.length} steps correct</div>
                <div style={{fontSize:13,color:T.textMuted}}>{results.every(r=>r.correct)?'Perfect!':'Keep building your understanding.'}</div>
              </div>
              <button onClick={nextPractice} style={{width:'100%',padding:'15px 24px',borderRadius:12,border:'none',background:`linear-gradient(135deg,${T.accent},${T.accentLight})`,color:T.bg,fontSize:16,fontWeight:700,fontFamily:FONT,cursor:'pointer'}}>
                {probIdx<ch.practice.length-1?'Next Practice \u2192':'See Results \u2192'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══ DONE ═══
  if(phase==='done') {
    const pct=total>0?Math.round(score/total*100):0;
    return (
      <div ref={scrollRef} style={{minHeight:'100vh',background:T.bg,color:T.text,fontFamily:BODY,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
        <style>{CSS}</style><Confetti/>
        <div style={{maxWidth:420,width:'100%',textAlign:'center'}}>
          <Trophy size={44} color={T.accent} className="au"/>
          <h2 className="au" style={{fontFamily:FONT,fontSize:26,fontWeight:700,margin:'14px 0 4px',animationDelay:'.1s'}}>Chapter Complete!</h2>
          <p className="au" style={{color:T.textMuted,fontSize:15,marginBottom:28,animationDelay:'.15s'}}>{ch.title}</p>
          <div className="au" style={{animationDelay:'.25s',borderRadius:18,padding:28,background:`linear-gradient(135deg,${T.accentDim},${T.surface})`,border:'1px solid '+T.accent+'30',marginBottom:28}}>
            <div style={{fontSize:52,fontWeight:700,fontFamily:FONT,color:T.accent}}>{pct}%</div>
            <div style={{color:T.textMuted,fontSize:13,marginBottom:14}}>{score} of {total} steps correct</div>
            <div style={{display:'flex',justifyContent:'center',gap:3}}>
              {[1,2,3,4,5].map(i=><Star key={i} size={22} fill={i<=Math.ceil(pct/20)?T.accent:'none'} color={i<=Math.ceil(pct/20)?T.accent:T.textDim}/>)}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {chIdx<CHAPTERS.length-1&&(
              <button onClick={()=>startChapter(chIdx+1)} style={{width:'100%',padding:'15px 24px',borderRadius:12,border:'none',background:`linear-gradient(135deg,${T.accent},${T.accentLight})`,color:T.bg,fontSize:15,fontWeight:700,fontFamily:FONT,cursor:'pointer'}}>
                Next: {CHAPTERS[chIdx+1].title} \u2192
              </button>
            )}
            <button onClick={()=>startChapter(chIdx)} style={{width:'100%',padding:'13px',borderRadius:12,border:'1px solid '+T.border,background:T.surface,color:T.textMuted,fontSize:13,cursor:'pointer',fontFamily:BODY}}>Study Again</button>
            <button onClick={goHome} style={{width:'100%',padding:'13px',borderRadius:12,border:'none',background:'none',color:T.textMuted,fontSize:13,cursor:'pointer',fontFamily:BODY}}>Back to Course</button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
