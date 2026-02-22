import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

import { AlertService } from '../shared/alert/alert.service';
import { MOCK_FORMATS, MOCK_DECKS, MOCK_FRIENDS, MOCK_FORM_DATA, MOCK_ARCHETYPES, MOCK_ENERGY_TYPES, MOCK_TRAINER_TYPES, MOCK_LOADING_STATES, MOCK_STATUS_INDICATORS } from './ui-showcase-mock-data';
import { TwinleafFormField } from '../shared/twinleaf-form/twinleaf-form.component';

@Component({
  selector: 'ptcg-ui-showcase',
  templateUrl: './ui-showcase.component.html',
  styleUrls: ['./ui-showcase.component.scss']
})
export class UiShowcaseComponent implements OnInit {
  mockFormats = MOCK_FORMATS;
  mockDecks = MOCK_DECKS;
  mockFriends = MOCK_FRIENDS;
  mockEnergyTypes = MOCK_ENERGY_TYPES;
  mockArchetypes = MOCK_ARCHETYPES;
  mockTrainerTypes = MOCK_TRAINER_TYPES;
  mockLoadingStates = MOCK_LOADING_STATES;
  mockStatusIndicators = MOCK_STATUS_INDICATORS;

  // Form examples
  exampleForm: UntypedFormGroup;
  formData = MOCK_FORM_DATA;

  // Twinleaf form field definitions
  loginFormFields: TwinleafFormField[] = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter username',
      required: true,
      validation: Validators.minLength(3)
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      required: true,
      validation: Validators.minLength(6)
    },
    {
      name: 'rememberMe',
      label: 'Remember me',
      type: 'checkbox'
    }
  ];

  futuristicFormFields: TwinleafFormField[] = [
    {
      name: 'trainerId',
      label: 'Trainer ID',
      type: 'text',
      placeholder: 'Enter trainer ID',
      required: true,
      validation: Validators.pattern(/^\d+$/),
      hint: 'Enter the trainer ID you want to send a request to'
    },
    {
      name: 'message',
      label: 'Message',
      type: 'text',
      placeholder: 'Optional message',
      hint: 'Add a personal message to your request'
    }
  ];

  minimalFormFields: TwinleafFormField[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter your name',
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      validation: Validators.email
    },
    {
      name: 'format',
      label: 'Preferred Format',
      type: 'select',
      placeholder: 'Select format',
      required: true,
      options: [
        { value: 'standard', label: 'Standard' },
        { value: 'glc', label: 'GLC' },
        { value: 'unlimited', label: 'Unlimited' }
      ]
    }
  ];

  // Interactive states
  loading = false;
  disabled = false;
  selectedTab = 0;
  selectedChip = 'Option 1';
  progressValue = 45;
  sliderValue = 30;

  // Table data
  displayedColumns: string[] = ['position', 'name', 'score', 'games', 'winRate'];

  constructor(
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private alertService: AlertService
  ) {
    this.exampleForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
      country: [''],
      newsletter: [false],
      age: [25, [Validators.min(18), Validators.max(100)]],
      bio: [''],
      file: [null]
    });
  }

  ngOnInit(): void {
    this.exampleForm.patchValue(this.formData);
  }

  // Button interactions
  onButtonClick(buttonType: string): void {
    this.snackBar.open(`${buttonType} button clicked!`, 'Close', { duration: 2000 });
  }

  onSearch(searchTerm: string): void {
    this.snackBar.open(`Searching for: ${searchTerm}`, 'Close', { duration: 2000 });
  }

  onFormChange(formData: any): void {
  }

  onFormSubmit(formData: any): void {
    this.snackBar.open('Form submitted successfully!', 'Close', { duration: 2000 });
  }

  onToggleLoading(): void {
    this.loading = !this.loading;
    if (this.loading) {
      setTimeout(() => this.loading = false, 2000);
    }
  }

  onToggleDisabled(): void {
    this.disabled = !this.disabled;
  }

  // Form interactions
  onSubmit(): void {
    if (this.exampleForm.valid) {
      this.snackBar.open('Form submitted successfully!', 'Close', { duration: 2000 });
    } else {
      this.snackBar.open('Please fix form errors', 'Close', { duration: 2000 });
    }
  }

  onResetForm(): void {
    this.exampleForm.reset();
    this.exampleForm.patchValue(this.formData);
  }

  // Dialog interactions
  openAlertDialog(): void {
    this.alertService.alert('This is an alert dialog', 'Alert');
  }

  openConfirmDialog(): void {
    this.alertService.confirm('Are you sure you want to proceed?', 'Confirm Action')
      .then(result => {
        if (result) {
          this.snackBar.open('Action confirmed!', 'Close', { duration: 2000 });
        }
      });
  }

  openInputDialog(): void {
    this.alertService.inputName({ message: 'Enter your name:', title: 'Input Name' })
      .then(result => {
        if (result) {
          this.snackBar.open(`Hello, ${result}!`, 'Close', { duration: 2000 });
        }
      });
  }

  openSelectDialog(): void {
    this.alertService.select({
      message: 'Choose an option:',
      title: 'Select Option',
      options: [
        { value: 'option1', viewValue: 'Option 1' },
        { value: 'option2', viewValue: 'Option 2' },
        { value: 'option3', viewValue: 'Option 3' }
      ]
    }).then(result => {
      if (result) {
        this.snackBar.open(`Selected: ${result}`, 'Close', { duration: 2000 });
      }
    });
  }

  // Progress interactions
  onProgressChange(value: number): void {
    this.progressValue = value;
  }

  onSliderChange(value: number): void {
    this.sliderValue = value;
  }

  // Chip interactions
  onChipSelection(chip: string): void {
    this.selectedChip = chip;
  }

  // Tab interactions
  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  // Menu interactions
  onMenuAction(action: string): void {
    this.snackBar.open(`Menu action: ${action}`, 'Close', { duration: 2000 });
  }

  // Card interactions
  onCardClick(card: any): void {
    this.snackBar.open(`Clicked on ${card.name}`, 'Close', { duration: 2000 });
  }

  // User interactions
  onUserClick(user: any): void {
    this.snackBar.open(`Clicked on ${user.name}`, 'Close', { duration: 2000 });
  }
}
