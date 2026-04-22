import type { HLJSApi, Language } from 'highlight.js';

/**
 * Lean 4 syntax highlighting grammar for highlight.js.
 */
export default function lean4(hljs: HLJSApi): Language {
	const KEYWORDS = {
		keyword:
			'theorem lemma def example where let in do if then else match with return ' +
			'have show suffices calc by sorry ' +
			'inductive structure class instance extends ' +
			'namespace section open import set_option ' +
			'variable universe noncomputable partial unsafe ' +
			'private protected mutual attribute deriving ' +
			'axiom constant opaque abbrev ' +
			'for while break continue ' +
			'fun macro syntax elab tactic',
		built_in:
			'Prop Type Sort Nat Int Bool True False Unit ' +
			'String List Option IO Fin Array ' +
			'Decidable Inhabited Repr ToString',
		literal: 'true false'
	};

	const LINE_COMMENT = hljs.COMMENT('--', '$');
	const BLOCK_COMMENT = hljs.COMMENT('/\\-', '\\-/');

	const STRING = {
		className: 'string',
		begin: '"',
		end: '"',
		contains: [{ begin: '\\\\.' }]
	};

	const CHAR = {
		className: 'string',
		begin: "'",
		end: "'",
		contains: [{ begin: '\\\\.' }]
	};

	const NUMBER = {
		className: 'number',
		variants: [
			{ begin: '\\b0[xX][0-9a-fA-F_]+' },
			{ begin: '\\b0[bB][01_]+' },
			{ begin: '\\b0[oO][0-7_]+' },
			{ begin: '\\b[0-9][0-9_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?' }
		]
	};

	const OPERATOR = {
		className: 'operator',
		begin: '[+\\-*/=<>≤≥≠∧∨¬∀∃→←↔⊢⊣∈∉⊆⊇⊂⊃∪∩∅⟨⟩⟪⟫▸▹◂◃∘×÷±∓≡≅≈∼]+'
	};

	const TACTIC_BLOCK = {
		className: 'meta',
		begin: '\\b(simp|ring|omega|norm_num|decide|trivial|exact|apply|intro|cases|induction|rfl|ext|congr|constructor|use|refine|rw|rewrite|conv|aesop|linarith|nlinarith|positivity|push_neg|contrapose|by_contra|rcases|obtain|specialize|field_simp|ring_nf|norm_cast|push_cast|lift)\\b'
	};

	const ATTRIBUTE = {
		className: 'meta',
		begin: '@\\[',
		end: '\\]',
		contains: [hljs.QUOTE_STRING_MODE]
	};

	return {
		name: 'Lean 4',
		aliases: ['lean', 'lean4'],
		keywords: KEYWORDS,
		contains: [
			LINE_COMMENT,
			BLOCK_COMMENT,
			STRING,
			CHAR,
			NUMBER,
			OPERATOR,
			TACTIC_BLOCK,
			ATTRIBUTE,
			{
				className: 'title',
				begin: '\\b(theorem|lemma|def|structure|class|instance|inductive|abbrev)\\s+',
				end: '\\s|\\(|\\{|:|where',
				excludeBegin: true,
				excludeEnd: true
			}
		]
	};
}
