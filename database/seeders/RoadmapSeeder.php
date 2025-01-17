<?php

namespace Database\Seeders;

use App\Models\Domain;
use App\Models\Persona;
use App\Models\Roadmap;
use App\Models\Subject;
use App\Models\Checklist;
use App\Models\Milestone;
use App\Models\Adaptation;
use App\Models\Prerequisite;
use App\Models\AdaptationItem;
use Illuminate\Database\Seeder;
use App\Models\PrerequisiteItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoadmapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // "Computer science and information systems",
        // "Economics",
        // "Health care",

        $softwareEngineerRoadmap = Roadmap::create(
            [
                'title' => 'Software Engineer',
                'description' => 'A Software Engineer is an IT professional who designs, develops and maintains computer software at a company. They use their creativity and technical skills and apply the principles of software engineering to help solve new and ongoing problems for an organization.',
                'domain_id' => Domain::where('name', 'Computer Sciences')->first()->id,
                'image' => 'roadmaps/software-engineering.jpg'
            ]
        );
        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $softwareEngineerRoadmap->id,
        ]);
        PrerequisiteItem::create([
            'name' => 'Achieve C or above in English',
            'subject_id' => Subject::where('subject_name', 'English')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);
        $adaptation = Adaptation::create([
            'name' => 'Adaptation',
            'description' => 'Adaptation is the process of adjusting to new conditions.',
            'roadmap_id' => $softwareEngineerRoadmap->id,
        ]);
        AdaptationItem::create([
            'name' => 'Adaptation',
            'persona_id' => Persona::where('name', 'Problem Solving')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        $internationalFinanceRoadmap = Roadmap::create([
            'title' => 'International Finance Professional',
            'description' => 'International Finance professionals analyze global financial markets, manage cross-border investments, and provide strategic financial guidance for international operations. They work with multinational corporations, investment firms, and financial institutions to navigate the complex world of global finance.',
            'domain_id' => Domain::where('name', 'Economics')->first()->id,
            'image' => 'roadmaps/international-finance.jpg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $internationalFinanceRoadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in English',
            'subject_id' => Subject::where('subject_name', 'English')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Mathematics',
            'subject_id' => Subject::where('subject_name', 'Mathematics')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in International Finance',
            'roadmap_id' => $internationalFinanceRoadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Analytical Thinking',
            'persona_id' => Persona::where('name', 'Problem solving')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        AdaptationItem::create([
            'name' => 'Organization Skills',
            'persona_id' => Persona::where('name', 'Organization')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Arts & Entertainment Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Visual Arts Professional',
            'description' => 'Visual Arts professionals create and develop visual content across various mediums, combining artistic skills with technical knowledge to produce compelling visual experiences.',
            'domain_id' => Domain::where('name', 'Arts & Entertainment')->first()->id,
            'image' => 'roadmaps/visual-arts.jpg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in English',
            'subject_id' => Subject::where('subject_name', 'English')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Visual Arts',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Creative Thinking',
            'persona_id' => Persona::where('name', 'Creativity')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        AdaptationItem::create([
            'name' => 'Open to New Ideas',
            'persona_id' => Persona::where('name', 'Openness')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Islamic Studies Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Islamic Scholar',
            'description' => 'Islamic Scholars are experts in Islamic theology, law, and ethics, providing guidance and education in religious matters while conducting research in Islamic studies.',
            'domain_id' => Domain::where('name', 'Islamic Studies')->first()->id,
            'image' => 'roadmaps/islamic-studies.jpg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve A in Pendidikan Islam',
            'subject_id' => Subject::where('subject_name', 'Pendidikan Islam')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'a'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in History',
            'subject_id' => Subject::where('subject_name', 'History')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Islamic Studies',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Strong Integrity',
            'persona_id' => Persona::where('name', 'Integrity')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        AdaptationItem::create([
            'name' => 'Dedication to Learning',
            'persona_id' => Persona::where('name', 'Diligent')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Engineering Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Mechanical Engineer',
            'description' => 'Mechanical Engineers design, manufacture, and maintain mechanical systems and equipment, applying principles of physics and materials science to solve complex engineering challenges.',
            'domain_id' => Domain::where('name', 'Engineering')->first()->id,
            'image' => 'roadmaps/mechanical-engineering.jpeg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Physics',
            'subject_id' => Subject::where('subject_name', 'Physics')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Mathematics',
            'subject_id' => Subject::where('subject_name', 'Mathematics')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Additional Mathematics',
            'subject_id' => Subject::where('subject_name', 'Additional Mathematics')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Mechanical Engineering',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Problem Solving Skills',
            'persona_id' => Persona::where('name', 'Problem solving')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        AdaptationItem::create([
            'name' => 'Technical Creativity',
            'persona_id' => Persona::where('name', 'Creativity')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Oil & Gas Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Petroleum Engineer',
            'description' => 'Petroleum Engineers develop methods for extracting oil and gas from deposits below the Earth\'s surface, and design equipment and processes to achieve the maximum profitable recovery of these resources.',
            'domain_id' => Domain::where('name', 'Oil & Gas')->first()->id,
            'image' => 'roadmaps/petroleum-engineering.jpg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Chemistry',
            'subject_id' => Subject::where('subject_name', 'Chemistry')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Physics',
            'subject_id' => Subject::where('subject_name', 'Physics')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Mathematics',
            'subject_id' => Subject::where('subject_name', 'Mathematics')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Petroleum Engineering',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Technical Problem Solving',
            'persona_id' => Persona::where('name', 'Problem solving')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        AdaptationItem::create([
            'name' => 'Analytical Mindset',
            'persona_id' => Persona::where('name', 'Diligent')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Psychology Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Clinical Psychologist',
            'description' => 'Clinical Psychologists assess, diagnose, and treat mental, emotional, and behavioral disorders. They help individuals cope with problems ranging from short-term personal issues to severe, chronic conditions.',
            'domain_id' => Domain::where('name', 'Psychology')->first()->id,
            'image' => 'roadmaps/psychology.jpg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Biology',
            'subject_id' => Subject::where('subject_name', 'Biology')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in English',
            'subject_id' => Subject::where('subject_name', 'English')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Clinical Psychology',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Empathy and Compassion',
            'persona_id' => Persona::where('name', 'Compassion')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        AdaptationItem::create([
            'name' => 'Active Listening',
            'persona_id' => Persona::where('name', 'Communication')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Agriculture Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Agricultural Scientist',
            'description' => 'Agricultural Scientists conduct research to improve agricultural productivity and food sustainability while developing new methods for crop production and livestock farming.',
            'domain_id' => Domain::where('name', 'Agriculture')->first()->id,
            'image' => 'roadmaps/agriculture.jpg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Biology',
            'subject_id' => Subject::where('subject_name', 'Biology')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in Chemistry',
            'subject_id' => Subject::where('subject_name', 'Chemistry')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Agricultural Science',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Research Mindset',
            'persona_id' => Persona::where('name', 'Curiosity')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        AdaptationItem::create([
            'name' => 'Environmental Awareness',
            'persona_id' => Persona::where('name', 'Conscientiousness')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Education Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Education Professional',
            'description' => 'Education Professionals shape the future by teaching and developing curriculum, implementing effective teaching methods, and fostering a positive learning environment for students.',
            'domain_id' => Domain::where('name', 'Education')->first()->id,
            'image' => 'roadmaps/education.jpg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Bahasa Melayu',
            'subject_id' => Subject::where('subject_name', 'Bahasa Melayu')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in English',
            'subject_id' => Subject::where('subject_name', 'English')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in Mathematics',
            'subject_id' => Subject::where('subject_name', 'Mathematics')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Education',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Empathy and Compassion',
            'persona_id' => Persona::where('name', 'Compassion')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Health & Nursing Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Registered Nurse',
            'description' => 'Registered Nurses provide and coordinate patient care, educate patients about various health conditions, and provide advice and emotional support to patients and their families.',
            'domain_id' => Domain::where('name', 'Health & Nursing')->first()->id,
            'image' => 'roadmaps/nursing.jpg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Biology',
            'subject_id' => Subject::where('subject_name', 'Biology')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in Chemistry',
            'subject_id' => Subject::where('subject_name', 'Chemistry')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in English',
            'subject_id' => Subject::where('subject_name', 'English')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Nursing',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Patient Care',
            'persona_id' => Persona::where('name', 'Compassion')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        AdaptationItem::create([
            'name' => 'Reliability',
            'persona_id' => Persona::where('name', 'Dependable')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Forestry Science Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Forest Conservation Specialist',
            'description' => 'Forest Conservation Specialists work to protect and manage forest ecosystems, conducting research on forest health, implementing conservation strategies, and developing sustainable forest management practices.',
            'domain_id' => Domain::where('name', 'Forestry Science')->first()->id,
            'image' => 'roadmaps/forestry.jpg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Biology',
            'subject_id' => Subject::where('subject_name', 'Biology')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in Chemistry',
            'subject_id' => Subject::where('subject_name', 'Chemistry')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Forest Conservation',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Environmental Stewardship',
            'persona_id' => Persona::where('name', 'Conscientiousness')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        AdaptationItem::create([
            'name' => 'Research Interest',
            'persona_id' => Persona::where('name', 'Curiosity')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Food Science Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Food Technologist',
            'description' => 'Food Technologists research and develop new food products, improve existing products, and ensure food safety and quality through scientific analysis and innovation.',
            'domain_id' => Domain::where('name', 'Food Science')->first()->id,
            'image' => 'roadmaps/food-science.jpeg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Chemistry',
            'subject_id' => Subject::where('subject_name', 'Chemistry')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Biology',
            'subject_id' => Subject::where('subject_name', 'Biology')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Food Technology',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Innovation Mindset',
            'persona_id' => Persona::where('name', 'Creativity')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        AdaptationItem::create([
            'name' => 'Quality Focus',
            'persona_id' => Persona::where('name', 'Conscientiousness')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Nature Science Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Environmental Scientist',
            'description' => 'Environmental Scientists study the environment and how it affects human health, developing solutions to environmental problems and working to protect natural resources.',
            'domain_id' => Domain::where('name', 'Nature Science')->first()->id,
            'image' => 'roadmaps/environmental-science.jpg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Biology',
            'subject_id' => Subject::where('subject_name', 'Biology')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in Chemistry',
            'subject_id' => Subject::where('subject_name', 'Chemistry')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in Physics',
            'subject_id' => Subject::where('subject_name', 'Physics')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Environmental Science',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Environmental Awareness',
            'persona_id' => Persona::where('name', 'Conscientiousness')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);

        // Social Science Roadmap
        $roadmap = Roadmap::create([
            'title' => 'Sociologist',
            'description' => 'Sociologists study human society and social behavior by examining the groups, cultures, organizations, social institutions, and processes that develop when people interact and work together.',
            'domain_id' => Domain::where('name', 'Social Science')->first()->id,
            'image' => 'roadmaps/sociology.jpg'
        ]);

        $trialsSPMPrerequisite = Prerequisite::create([
            'name' => 'Trials SPM',
            'description' => 'Target grades for SPM trial examinations',
            'roadmap_id' => $roadmap->id,
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve B or above in History',
            'subject_id' => Subject::where('subject_name', 'History')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'b'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in English',
            'subject_id' => Subject::where('subject_name', 'English')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        PrerequisiteItem::create([
            'name' => 'Achieve C or above in Bahasa Melayu',
            'subject_id' => Subject::where('subject_name', 'Bahasa Melayu')->first()->id,
            'prerequisite_id' => $trialsSPMPrerequisite->id,
            'requirement' => 'c'
        ]);

        $adaptation = Adaptation::create([
            'name' => 'Required Traits',
            'description' => 'Key personality traits for success in Sociology',
            'roadmap_id' => $roadmap->id,
        ]);

        AdaptationItem::create([
            'name' => 'Research Mindset',
            'persona_id' => Persona::where('name', 'Curiosity')->first()->id,
            'adaptation_id' => $adaptation->id,
        ]);
    }
}
