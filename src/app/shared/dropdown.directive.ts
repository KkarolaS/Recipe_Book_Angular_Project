import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropDownDirective {
  @HostBinding('class.open') isClicked: boolean = false;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isClicked = this.elRef.nativeElement.contains(event.target)
      ? !this.isClicked
      : false;
  }
  constructor(private elRef: ElementRef) {}
}

//   className: string = 'open';
//   isClicked: boolean = false;

//   constructor(private elRef: ElementRef, private renderer: Renderer2) {}

//   @HostListener('click') toggleOpen() {
//     this.isClicked = !this.isClicked;
//     if (this.isClicked) {
//       this.renderer.addClass(this.elRef.nativeElement, this.className);
//     } else {
//       this.renderer.removeClass(this.elRef.nativeElement, this.className);
//     }
//   }
