import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {getPasswordStrengthScore} from "../../utils/functions";

@Component({
  selector: 'app-password-strength-meter',
  standalone: true,
  imports: [],
  templateUrl: './password-strength-meter.component.html',
  styleUrl: './password-strength-meter.component.scss'
})
export class PasswordStrengthMeterComponent implements OnChanges {

  @Input() password: string;
  @Input() minPasswordLength = 8;
  @Input() colors: string[] = [];

  @Output() strengthChange = new EventEmitter<number>();

  passwordStrength: number = null;

  private prevPasswordStrength: number = null;
  private defaultColours = [
    'darkred',
    'orangered',
    'orange',
    'yellowgreen',
    'green'
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['password']) {
      this.calculatePasswordStrength();
    }
  }

  getMeterFillColor(strength: number) {
    if (!strength || strength < 0 || strength > 5) {
      return this.colors[0] ? this.colors[0] : this.defaultColours[0];
    }

    return this.colors[strength] || this.defaultColours[strength];
  }

  private calculatePasswordStrength() {
    if (!this.password) {
      this.passwordStrength = null;
    } else if (this.password && this.password.length < this.minPasswordLength) {
      this.passwordStrength = 0;
    } else {
      this.passwordStrength = getPasswordStrengthScore(this.password);
    }

    // Only emit the passwordStrength if it changed
    if (this.prevPasswordStrength !== this.passwordStrength) {
      this.strengthChange.emit(this.passwordStrength);
      this.prevPasswordStrength = this.passwordStrength;
    }
  }

}
