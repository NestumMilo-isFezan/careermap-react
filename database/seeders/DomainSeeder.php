<?php

namespace Database\Seeders;

use App\Models\Domain;
use App\Models\Stream;
use App\Models\StreamDomainWeight;
use Illuminate\Database\Seeder;

class DomainSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define domains with their weights for different streams
        $domains = [
            "Arts & Entertainment" => [
                'science' => 0.3,
                'non_science' => 0.9
            ],
            "Islamic Studies" => [
                'science' => 0.4,
                'non_science' => 0.8
            ],
            "International Finance & Marketing" => [
                'science' => 0.6,
                'non_science' => 0.9
            ],
            "Computer Sciences" => [
                'science' => 0.95,
                'non_science' => 0.6
            ],
            "Engineering" => [
                'science' => 0.95,
                'non_science' => 0.3
            ],
            "Oil & Gas" => [
                'science' => 0.9,
                'non_science' => 0.2
            ],
            "Economics" => [
                'science' => 0.6,
                'non_science' => 0.9
            ],
            "Psychology" => [
                'science' => 0.8,
                'non_science' => 0.7
            ],
            "Agriculture" => [
                'science' => 0.85,
                'non_science' => 0.4
            ],
            "Education" => [
                'science' => 0.7,
                'non_science' => 0.7
            ],
            "Health & Nursing" => [
                'science' => 0.9,
                'non_science' => 0.3
            ],
            "Forestry Science" => [
                'science' => 0.85,
                'non_science' => 0.4
            ],
            "Food Science" => [
                'science' => 0.9,
                'non_science' => 0.5
            ],
            "Nature Science" => [
                'science' => 0.9,
                'non_science' => 0.4
            ],
            "Social Science" => [
                'science' => 0.5,
                'non_science' => 0.9
            ]
        ];

        // Get stream IDs
        $scienceStream = Stream::where('name', 'Science Stream')->first();
        $nonScienceStream = Stream::where('name', 'Non-Science Stream')->first();

        // Create domains and their weights
        foreach ($domains as $domainName => $weights) {
            // Create domain
            $domain = Domain::create([
                'name' => $domainName,
                'description' => "Domain for {$domainName} related careers and studies"
            ]);

            // Create weights for science stream
            StreamDomainWeight::create([
                'stream_id' => $scienceStream->id,
                'domain_id' => $domain->id,
                'weight' => $weights['science']
            ]);

            // Create weights for non-science stream
            StreamDomainWeight::create([
                'stream_id' => $nonScienceStream->id,
                'domain_id' => $domain->id,
                'weight' => $weights['non_science']
            ]);
        }
    }
}
