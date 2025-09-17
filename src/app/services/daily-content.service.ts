import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HebDateService } from './heb-date.service';

@Injectable({
  providedIn: 'root'
})
export class DailyContentService {
  private readonly PICTURES_DIR = 'assets/pictures/';
  private readonly SENTENCES_FILE = 'assets/sentences_of_shaul.json';
  
  // Complete list of all available pictures
  private readonly ALL_IMAGES = [
    '52.jpg',
    '8169f4.jpg',
    'BY1A4457.jpg',
    'DJI_0021-Edit-3.jpg',
    'DJI_0138-Edit-2.jpg',
    'DJI_0185-Edit-2.jpg',
    'DJI_0480-Edit.jpg',
    'DSC_1317-Edit-Edit-Edit-Edit.jpg',
    'DSC_2370-Edit-Edit-Edit.jpg',
    'DSC0163-Edit-1.jpg',
    'DSC3336-Edit-Edit-Edit-2.jpg',
    'DSC3369-HDR-Edit-Edit-3.jpg',
    'DSC9009-Enhanced-NR-Edit-Edit.jpg',
    'DSC9235-Edit-2.jpg',
    'eddie-carolina-stigson-ecIZe6MdUH8-unsplash.jpg',
    'istockphoto-851548830-612x612.jpg',
    'pexels-ahmad-basem-739226667-26582242.jpg',
    'pexels-andrew-longanecker-968710-10326155.jpg',
    'pexels-dalia-nava-167975-7910073.jpg',
    'pexels-igor-meghega-315695093-15496524.jpg',
    'pexels-lio-voo-262755153-12730615.jpg',
    'pexels-migo-5555211.jpg',
    'pexels-omerhavivi-4084651.jpg',
    'pexels-ronrov-11572780.jpg',
    'pexels-ronrov-13076919.jpg',
    'pexels-ronrov-15364165.jpg',
    'pexels-ronrov-17033088.jpg',
    'pexels-samir-smier-314916757-30065672.jpg',
    'pexels-sunbeam-114409506-10890371.jpg',
    'pexels-svebar15-3927155.jpg',
    'pexels-tom-kardashov-314272-897233.jpg',
    'pexels-u-h-448257719-30645993.jpg',
    'pexels-uri-baruch-3733899-5559878.jpg',
    'pexels-veronika-83913222-8862648.jpg',
    'roman-kurnovskii-a5GR-GxrH-Q-unsplash.jpg',
    'tijs-van-leur-9bd6LStI8ug-unsplash.jpg',
    'Untitled_Panorama-2121.jpg',
    'WhatsApp-Image-2021-03-18-at-19.02.44-1.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.02.44-14-1536x1025.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.02.44-15.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.02.44-17.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.02.44-18.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.02.44-22.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.02.44-25 (1).jpeg',
    'WhatsApp-Image-2021-03-18-at-19.02.44-25.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.02.44-26.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.02.44-27.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.02.44-5.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.07.27-2.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.07.27-4.jpeg',
    'WhatsApp-Image-2021-03-18-at-19.07.27.jpeg',
    'yoav-aziz-SBNHtj_x7Jo-unsplash.jpg',
    'yousef-espanioly-CxLJcCH_vAI-unsplash.jpg',
    'ללא-שם.jpg'
  ];
  
  constructor(private http: HttpClient, private hebDateService: HebDateService) {}

  getDailyContent(): Observable<{image: string, quote: string, omerText?: string}> {
    return this.http.get<any>(this.SENTENCES_FILE).pipe(
      map(data => {
        const quotes = data.paragraphs;
        
        // Use Omer day if we're in Omer period, otherwise use day of year
        let dayIndex: number;
        let omerText: string | undefined;
        
        if (this.hebDateService.isOmer && this.hebDateService.omerNum > 0) {
          // During Omer period - use Omer day (1-49)
          dayIndex = this.hebDateService.omerNum - 1; // Convert to 0-based index
          omerText = this.hebDateService.omer;
        } else {
          // Outside Omer period - use day of year
          const today = new Date();
          dayIndex = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        }
        
        // Create consistent but pseudo-random mapping for the entire Omer period
        const imageIndex = this.getPseudoRandomIndex(dayIndex, this.ALL_IMAGES.length);
        const quoteIndex = this.getPseudoRandomIndex(dayIndex + 17, quotes.length); // Offset for different randomization
        
        return {
          image: this.PICTURES_DIR + this.ALL_IMAGES[imageIndex],
          quote: quotes[quoteIndex],
          omerText: omerText
        };
      })
    );
  }
  
  /**
   * Generate pseudo-random but consistent index based on day
   * This ensures the same day always gets the same image/quote
   */
  private getPseudoRandomIndex(seed: number, arrayLength: number): number {
    // Simple pseudo-random function that's consistent for the same seed
    let hash = seed;
    hash = ((hash << 5) - hash + seed) & 0xffffffff;
    hash = ((hash << 5) - hash + 42) & 0xffffffff;
    return Math.abs(hash) % arrayLength;
  }
  
  /**
   * Get specific Omer day content (for generating images)
   */
  getOmerDayContent(omerDay: number): Observable<{image: string, quote: string, omerText: string}> {
    return this.http.get<any>(this.SENTENCES_FILE).pipe(
      map(data => {
        const quotes = data.paragraphs;
        const dayIndex = omerDay - 1; // Convert to 0-based
        
        // Get Omer text for this day
        const omerData = this.hebDateService.getOmerForDay(omerDay);
        
        const imageIndex = this.getPseudoRandomIndex(dayIndex, this.ALL_IMAGES.length);
        const quoteIndex = this.getPseudoRandomIndex(dayIndex + 17, quotes.length);
        
        return {
          image: this.PICTURES_DIR + this.ALL_IMAGES[imageIndex],
          quote: quotes[quoteIndex],
          omerText: omerData?.omer || `יום ${omerDay} לעומר`
        };
      })
    );
  }
} 