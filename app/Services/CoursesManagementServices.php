<?php

namespace App\Services;

use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\CssSelector\CssSelectorConverter;

class CoursesManagementServices
{
    protected $client;
    protected $institutions;
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $this->client = new Client();
        $this->institutions = [
            'uitm' => 'https://online.uitm.edu.my/degree.cfm',
        ];
    }

    public function getCourseInfoFrom(string $institute){
        if (!isset($this->institutions[$institute])) {
            throw new \Exception('Invalid institute');
        }

        $url = $this->institutions[$institute];

        try{
            $response = $this->client->request('GET', $url);
            $html = $response->getBody()->getContents();
            $crawler = new Crawler($html);

            $scraperFunction = "{$institute}API";
            if(method_exists($this, $scraperFunction)){
                return $this->$scraperFunction($crawler);
            }
            else{
                return [
                    'message' => 'Scraper not found. Invalid institution name.'
                ];
            }

        }
        catch(\Exception $e){
            return [
                'message' => $e->getMessage()
            ];
        }
    }

    protected function uitmAPI(Crawler $crawler){
        $facultyName = "";
        $courseCode = "";

        $course = $crawler->filter("tbody tr td")->each(function ($node) use (&$facultyName, &$courseCode) {
            // $facultyName = $this->toTitleCase($node->attr('id', 'title'));
            $title = "";
            if($node->attr('id') === 'title'){
                $text = $this->cleanText($node->text());
                $facultyName = $this->toTitleCase($text);
            }
            elseif($node->attr('id') !== 'center' && $node->attr('id') !== 'title'){
                $title = $this->toTitleCase($node->text());
            }
            elseif($node->attr('id') === 'center' && $node->attr('id') !== 'title'){
                $courseCode = $node->text();
            }

            if($title !== "" && $courseCode !== ""){
                return $node = [
                    'course_name' => $title,
                    'course_code' => $courseCode,
                    'institution_name' => 'UITM',
                    'course_level' => 'Undergraduate',
                    'faculty_name' => $facultyName,
                ];
            }
        });

        $cleanedCourses = array_values(array_filter($course));
        return $cleanedCourses;
    }

    private function toTitleCase($string)
    {
        return mb_convert_case($string, MB_CASE_TITLE, "UTF-8");
    }

    private function cleanText($string)
    {
        $text = preg_replace('/\s*<span.*?<\/span>/', '', $string);
        $text = preg_replace('/^\d+\./', '', $text);
        $text = substr($text, 0, -2);
        return trim($text);
    }
}
