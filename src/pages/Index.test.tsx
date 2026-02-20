import { describe, it, expect } from 'vitest';
import { renderMarkdown, profileSchema } from './Index';

describe('Frontend Logic Tests', () => {
    describe('renderMarkdown', () => {
        it('should render bold text correctly', () => {
            expect(renderMarkdown('**bold**')).toBe('<strong>bold</strong>');
        });

        it('should render italic text correctly', () => {
            expect(renderMarkdown('*italic*')).toBe('<em>italic</em>');
        });

        it('should render list items correctly', () => {
            const input = '- Item 1\n- Item 2';
            const output = renderMarkdown(input);
            expect(output).toContain('<li>Item 1</li>');
            expect(output).toContain('<li>Item 2</li>');
            expect(output).toContain('<ul');
        });

        it('should render blockquotes correctly', () => {
            expect(renderMarkdown('> quote')).toContain('<blockquote');
        });
    });

    describe('profileSchema', () => {
        it('should validate correct profile data', () => {
            const data = {
                specialization: 'IT',
                gpa: '3.5',
                credits: '80',
                gradePoints: '300',
                faculty: 'Computing',
                careerInterest: 'AI',
                strongSubjects: 'Coding',
                weakSubjects: 'None',
                difficulty: 'Moderate',
                language: 'English'
            };
            const result = profileSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('should fail on invalid GPA', () => {
            const data = { gpa: '5.0' }; // Out of range
            const result = profileSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('should fail on empty required fields', () => {
            const data = { specialization: '' };
            const result = profileSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });
});
