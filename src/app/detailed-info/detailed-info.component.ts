// detailed-info.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-detailed-info',
  templateUrl: './detailed-info.component.html',
  styleUrls: ['./detailed-info.component.scss']
})
export class DetailedInfoComponent implements OnInit {
  comets: any[] = [];
  paginatedComets: any[] = [];
  displayedColumns: string[] = ['object_name', 'q_au_1', 'p_yr', 'moid_au', 'actions'];

  // Pagination variables
  pageSize: number = 10;
  currentPage: number = 0;
  totalComets: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedComet: any = null;
  cometModalVisible: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadComets();
  }

  loadComets(): void {
    this.apiService.getNearEarthComets().subscribe({
      next: (data) => {
        this.comets = data;
        this.totalComets = data.length;
        this.setPaginatedComets();
      },
      error: (error) => {
        console.error('Error fetching comets:', error);
        alert(`Error: ${error.message || 'An unknown error occurred.'}`);
      }
    });
  }

  setPaginatedComets(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedComets = this.comets.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPaginatedComets();
  }

  showCometModal(comet: any) {
    this.selectedComet = comet; // Set the selected comet details
    this.cometModalVisible = true; // Show the modal
  }

  // Method to close the comet modal
  closeCometModal() {
    this.cometModalVisible = false; // Close the modal
    this.selectedComet = null; // Clear the selected comet
  }
}
